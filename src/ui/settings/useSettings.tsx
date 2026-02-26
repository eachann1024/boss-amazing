import * as React from 'react'
import type { Settings, Stats } from '@/shared/types'
import { loadSettings, saveSettings, loadStats, saveStats } from '@/shared/storage'

type SettingsContextValue = {
  settings: Settings | null
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>
  stats: Stats | null
  setStats: React.Dispatch<React.SetStateAction<Stats | null>>
  save: () => Promise<void>
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings | null>(null)
  const [stats, setStats] = React.useState<Stats | null>(null)

  React.useEffect(() => {
    loadSettings().then(setSettings)
    loadStats().then(setStats)
  }, [])

  React.useEffect(() => {
    if (stats) {
      saveStats(stats).catch(() => {})
    }
  }, [stats])

  const save = React.useCallback(async () => {
    if (settings) {
      await saveSettings(settings)
    }
    if (stats) {
      await saveStats(stats)
    }
  }, [settings, stats])

  const value = React.useMemo(
    () => ({ settings, setSettings, stats, setStats, save }),
    [settings, stats, save]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return ctx
}
