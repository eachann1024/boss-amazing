import type { Settings, Stats } from '@/shared/types'
import { DEFAULT_SETTINGS, DEFAULT_STATS } from '@/shared/defaults'

const SETTINGS_KEY = 'boss-awesome:settings'
const STATS_KEY = 'boss-awesome:stats'

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  }
  catch {
    return fallback
  }
}

function lsSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function normalizeSettings(data: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...data,
    jobTitleFilter: { ...DEFAULT_SETTINGS.jobTitleFilter, ...data.jobTitleFilter },
    jobContentFilter: { ...DEFAULT_SETTINGS.jobContentFilter, ...data.jobContentFilter },
    salaryRange: { ...DEFAULT_SETTINGS.salaryRange, ...data.salaryRange },
    filters: { ...DEFAULT_SETTINGS.filters, ...data.filters },
    ai: { ...DEFAULT_SETTINGS.ai, ...data.ai },
    greeting: { ...DEFAULT_SETTINGS.greeting, ...data.greeting },
  }
}

export async function loadSettings(): Promise<Settings> {
  const data = lsGet<Partial<Settings>>(SETTINGS_KEY, {})
  return normalizeSettings(data)
}

export async function saveSettings(settings: Settings): Promise<void> {
  lsSet(SETTINGS_KEY, settings)
}

export async function loadStats(): Promise<Stats> {
  const data = lsGet<Partial<Stats>>(STATS_KEY, {})
  return { ...DEFAULT_STATS, ...data, reasons: { ...DEFAULT_STATS.reasons, ...(data.reasons ?? {}) } }
}

export async function saveStats(stats: Stats): Promise<void> {
  lsSet(STATS_KEY, stats)
}

export async function loadHistory() {
  return { companies: [] as string[], hrs: [] as string[] }
}

export function saveHistory() {
  return Promise.resolve()
}

export function resetStats(): Promise<void> {
  lsSet(STATS_KEY, DEFAULT_STATS)
  return Promise.resolve()
}
