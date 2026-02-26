import type { AiConfig } from '@/shared/types'
import { loadSettings } from '@/shared/storage'
import { requestGreeting, requestScore, requestModelList } from '@/shared/ai'

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message?.type?.startsWith('ai:')) return

    const handler = async () => {
      const settings = await loadSettings()
      const ai = settings.ai
      if (!ai.apiKey) {
        throw new Error('接口密钥未配置')
      }
      const prompt = message.payload?.prompt as string | undefined

      if (message.type === 'ai:score') {
        if (!prompt) {
          throw new Error('提示词为空')
        }
        const result = await requestScore(ai as AiConfig, prompt)
        return result.content
      }
      if (message.type === 'ai:greeting') {
        if (!prompt) {
          throw new Error('提示词为空')
        }
        const result = await requestGreeting(ai as AiConfig, prompt)
        return result.content
      }
      if (message.type === 'ai:verify') {
        const result = await requestGreeting(ai as AiConfig, '只返回: ok')
        return { content: result.content }
      }
      if (message.type === 'ai:list-models') {
        const result = await requestModelList(ai as AiConfig)
        return { models: result.models }
      }
      throw new Error(`不支持的消息类型: ${String(message.type)}`)
    }

    handler()
      .then((payload) => sendResponse({ ok: true, ...(typeof payload === 'string' ? { content: payload } : payload) }))
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }))

    return true
  })
})
