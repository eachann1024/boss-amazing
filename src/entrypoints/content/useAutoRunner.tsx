import * as React from 'react'
import type { JobCard, RunState, Settings } from '@/shared/types'
import { loadHistory, saveHistory } from '@/shared/storage'
import { extractJobCard, findChatInput, findJobCards, findSendButton, sleep, clickCardAction } from '@/shared/dom'
import { runPipeline } from '@/shared/pipeline'
import { buildGreetingPrompt } from '@/shared/prompts'
import { sanitizeGreeting } from '@/shared/ai'
import { useSettings } from '@/ui/settings/useSettings'

async function requestAI(type: 'score' | 'greeting', prompt: string) {
  return new Promise<string>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: `ai:${type}`, payload: { prompt } }, (response) => {
      const err = chrome.runtime.lastError
      if (err) {
        reject(err)
        return
      }
      if (!response?.ok) {
        reject(new Error(response?.error || 'AI 请求失败'))
        return
      }
      resolve(response.content as string)
    })
  })
}

function applyGreetingTemplate(template: string, job: JobCard) {
  return template
    .replace(/\{\{岗位名\}\}/g, job.jobName || '')
    .replace(/\{\{公司名\}\}/g, job.companyName || '')
    .replace(/\{\{薪资\}\}/g, job.salaryDesc || '')
    .replace(/\{\{城市\}\}/g, job.cityName || '')
    .replace(/\{\{HR\}\}/g, job.hrName || '')
}

function setInputValue(target: HTMLElement, text: string) {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    target.value = text
    target.dispatchEvent(new Event('input', { bubbles: true }))
    return
  }
  target.textContent = text
  target.dispatchEvent(new Event('input', { bubbles: true }))
}

async function sendGreeting(job: JobCard, greeting: string) {
  const cards = findJobCards()
  const card = cards.find((el) => el.innerText.includes(job.jobName)) || cards[0]
  if (card) {
    clickCardAction(card)
  }
  await sleep(800)
  const input = findChatInput()
  if (!input) {
    throw new Error('未找到聊天输入框')
  }
  setInputValue(input as HTMLElement, greeting)
  await sleep(300)
  const sendBtn = findSendButton()
  if (!sendBtn) {
    throw new Error('未找到发送按钮')
  }
  sendBtn.click()
}

function updateStatsWithReason(prev: NonNullable<ReturnType<typeof useSettings>['stats']>, reason: string) {
  const next = { ...prev, reasons: { ...prev.reasons } }
  next.reasons[reason] = (next.reasons[reason] || 0) + 1
  return next
}

export function useAutoRunner() {
  const { settings, stats, setStats } = useSettings()
  const [state, setState] = React.useState<RunState>({
    running: false,
    currentIndex: 0,
    total: 0,
  })
  const stopRef = React.useRef(false)

  const stop = React.useCallback(() => {
    stopRef.current = true
    setState((prev) => ({ ...prev, running: false, message: '已暂停' }))
  }, [])

  const start = React.useCallback(async () => {
    if (!settings || !stats) return
    if (!settings.ai.apiKey) {
      setState((prev) => ({ ...prev, message: '请先配置 AI Key' }))
      return
    }

    stopRef.current = false
    const history = await loadHistory()
    const historyState = {
      companies: new Set(history.companies),
      hrs: new Set(history.hrs),
    }

    const cards = findJobCards()
    setState({ running: true, currentIndex: 0, total: cards.length })

    for (let index = 0; index < cards.length; index += 1) {
      if (stopRef.current) break

      const job = extractJobCard(cards[index])
      setState((prev) => ({ ...prev, currentIndex: index + 1, message: job.jobName }))

      try {
        const aiClient = {
          score: async (prompt: string) => requestAI('score', prompt),
          greeting: async (prompt: string) => requestAI('greeting', prompt),
        }

        const result = await runPipeline(job, settings, historyState, aiClient, {
          skipGreeting: settings.greeting.useVariables,
        })
        if (result.status === 'filtered') {
          setStats((prev) => {
            if (!prev) return prev
            const next = { ...prev, total: prev.total + 1, filtered: prev.filtered + 1 }
            return updateStatsWithReason(next, result.reason || '过滤')
          })
          continue
        }

        if (job.companyName) {
          historyState.companies.add(job.companyName)
        }
        if (job.hrName) {
          historyState.hrs.add(job.hrName)
        }

        let greeting = result.greeting || ''
        if (settings.greeting.useVariables) {
          greeting = applyGreetingTemplate(settings.greeting.template, job)
        }

        if (!greeting) {
          const prompt = buildGreetingPrompt(settings, job)
          const raw = await requestAI('greeting', prompt)
          greeting = sanitizeGreeting(raw, job.jobName)
        }

        await sendGreeting(job, greeting)

        await saveHistory({
          companies: Array.from(historyState.companies).filter(Boolean),
          hrs: Array.from(historyState.hrs).filter(Boolean),
        })

        setStats((prev) => {
          if (!prev) return prev
          return { ...prev, total: prev.total + 1, sent: prev.sent + 1 }
        })
      }
      catch (err: any) {
        const reason = err?.message || '未知错误'
        setStats((prev) => {
          if (!prev) return prev
          const next = { ...prev, total: prev.total + 1, failed: prev.failed + 1 }
          return updateStatsWithReason(next, reason)
        })
      }

      await sleep(1500)
    }

    setState((prev) => ({ ...prev, running: false, message: '处理完成' }))
  }, [settings, stats, setStats])

  return { state, start, stop }
}
