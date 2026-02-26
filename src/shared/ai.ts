import type { AiConfig } from '@/shared/types'

export type AIResponse = {
  content: string
}

export async function requestGreeting(ai: AiConfig, prompt: string): Promise<AIResponse> {
  if (ai.provider === 'anthropic') {
    return requestClaude(ai, prompt)
  }
  return requestOpenAICompatible(ai, prompt)
}

export async function requestScore(ai: AiConfig, prompt: string): Promise<AIResponse> {
  if (ai.provider === 'anthropic') {
    return requestClaude(ai, prompt)
  }
  return requestOpenAICompatible(ai, prompt)
}

async function requestOpenAICompatible(ai: AiConfig, prompt: string): Promise<AIResponse> {
  const baseUrl = (ai.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '')
  const url = `${baseUrl}/chat/completions`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ai.apiKey}`,
    },
    body: JSON.stringify({
      model: ai.model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: '你是专业的求职助手。' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI 请求失败: ${res.status} ${text}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI 返回为空')
  }
  return { content }
}

async function requestClaude(ai: AiConfig, prompt: string): Promise<AIResponse> {
  const url = 'https://api.anthropic.com/v1/messages'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ai.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ai.model,
      max_tokens: 512,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Claude 请求失败: ${res.status} ${text}`)
  }

  const data = await res.json()
  const content = data?.content?.[0]?.text
  if (!content) {
    throw new Error('Claude 返回为空')
  }
  return { content }
}

export function sanitizeGreeting(raw: string, jobName?: string) {
  let text = raw.trim()
  text = text.replace(/^```[\s\S]*?```/g, '').trim()
  text = text.replace(/^[{\[]([\s\S]*?)[}\]]$/g, '$1').trim()

  if (!text.startsWith('您好，看到贵司')) {
    text = `您好，看到贵司${text.startsWith('您好') ? text.replace(/^您好[，,]?/, '') : text}`
  }

  if (jobName) {
    const escaped = jobName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(escaped, 'g')
    text = text.replace(re, '')
  }

  text = text.replace(/岗位/gi, '')
  text = text.replace(/\s{2,}/g, ' ').trim()
  return text
}

export function parseScore(content: string) {
  try {
    const json = JSON.parse(content)
    const score = Number(json?.score ?? 0)
    const reason = String(json?.reason ?? '')
    return { score, reason }
  }
  catch {
    const match = content.match(/"score"\s*:\s*(\d+)/)
    if (match) {
      return { score: Number(match[1]), reason: '解析失败，降级处理' }
    }
    return { score: 0, reason: '解析失败' }
  }
}
