import type { AiConfig } from '@/shared/types'
import { loadSettings } from '@/shared/storage'
import { requestGreeting, requestScore } from '@/shared/ai'

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message?.type?.startsWith('ai:')) return

    const handler = async () => {
      const settings = await loadSettings()
      const ai = settings.ai
      if (!ai.apiKey) {
        throw new Error('API Key 未配置')
      }
      const prompt = message.payload?.prompt as string | undefined

      if (message.type === 'ai:score') {
        if (!prompt) {
          throw new Error('Prompt 为空')
        }
        const result = await requestScore(ai as AiConfig, prompt)
        return result.content
      }
      if (message.type === 'ai:greeting') {
        if (!prompt) {
          throw new Error('Prompt 为空')
        }
        const result = await requestGreeting(ai as AiConfig, prompt)
        return result.content
      }
      if (message.type === 'ai:verify') {
        const result = await requestGreeting(ai as AiConfig, '只返回: ok')
        return result.content
      }
      throw new Error(`不支持的消息类型: ${String(message.type)}`)
    }

    handler()
      .then((content) => sendResponse({ ok: true, content }))
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }))

    return true
  })
})
