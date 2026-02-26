import type { Settings, Stats } from '@/shared/types'
import { DEFAULT_SETTINGS, DEFAULT_STATS } from '@/shared/defaults'

const SETTINGS_KEY = 'boss-awesome:settings'
const STATS_KEY = 'boss-awesome:stats'
const HISTORY_KEY = 'boss-awesome:history'

export type HistoryState = {
  companies: string[]
  hrs: string[]
}

const DEFAULT_HISTORY: HistoryState = {
  companies: [],
  hrs: [],
}

function getLocal<T>(key: string, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve((result?.[key] as T) ?? fallback)
    })
  })
}

function setLocal<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      const err = chrome.runtime.lastError
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
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
  const data = await getLocal<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS)
  return normalizeSettings(data)
}

export function saveSettings(settings: Settings) {
  return setLocal(SETTINGS_KEY, settings)
}

export async function loadStats(): Promise<Stats> {
  const data = await getLocal<Stats>(STATS_KEY, DEFAULT_STATS)
  return {
    ...DEFAULT_STATS,
    ...data,
    reasons: { ...DEFAULT_STATS.reasons, ...(data.reasons ?? {}) },
  }
}

export function saveStats(stats: Stats) {
  return setLocal(STATS_KEY, stats)
}

export async function loadHistory(): Promise<HistoryState> {
  const data = await getLocal<HistoryState>(HISTORY_KEY, DEFAULT_HISTORY)
  return {
    ...DEFAULT_HISTORY,
    ...data,
    companies: [...(data.companies ?? [])],
    hrs: [...(data.hrs ?? [])],
  }
}

export function saveHistory(history: HistoryState) {
  return setLocal(HISTORY_KEY, history)
}

export function resetStats() {
  return setLocal(STATS_KEY, DEFAULT_STATS)
}
