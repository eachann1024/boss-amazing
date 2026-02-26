import '@/entrypoints/content/style.css'

export default defineContentScript({
  matches: ['*://zhipin.com/*', '*://*.zhipin.com/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'manual',
  async main() {
    if (typeof document === 'undefined') return
    const { mountContentUI } = await import('@/ui/content-mount')
    await mountContentUI()
  },
})
