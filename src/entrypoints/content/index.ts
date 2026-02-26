import '@/entrypoints/content/style.css'

const MOUNT_GUARD_KEY = 'boss-awesome:mount-guard'
const MOUNT_GUARD_WINDOW_MS = 12_000
const MOUNT_GUARD_LIMIT = 3

function shouldSkipMountByRefreshGuard() {
  try {
    const now = Date.now()
    const path = location.pathname
    const raw = sessionStorage.getItem(MOUNT_GUARD_KEY)
    const prev = raw ? JSON.parse(raw) as { path: string; firstAt: number; count: number } : null
    if (prev && prev.path === path && now - prev.firstAt <= MOUNT_GUARD_WINDOW_MS) {
      const next = { path, firstAt: prev.firstAt, count: prev.count + 1 }
      sessionStorage.setItem(MOUNT_GUARD_KEY, JSON.stringify(next))
      return next.count > MOUNT_GUARD_LIMIT
    }
    sessionStorage.setItem(MOUNT_GUARD_KEY, JSON.stringify({ path, firstAt: now, count: 1 }))
    return false
  }
  catch {
    return false
  }
}

export default defineContentScript({
  matches: ['*://zhipin.com/*', '*://*.zhipin.com/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'manual',
  async main() {
    if (typeof document === 'undefined') return
    if (window.top !== window) return
    if (shouldSkipMountByRefreshGuard()) return
    const { mountContentUI } = await import('@/ui/content-mount')
    await mountContentUI()
  },
})
