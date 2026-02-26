import React from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from '@/ui/settings/useSettings'
import { SettingsButton } from '@/ui/settings/settings-button'

export function mountContentUI() {
  if (document.getElementById('boss-helper-lite-root')) return
  const container = document.createElement('div')
  container.id = 'boss-helper-lite-root'
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(
    <SettingsProvider>
      <SettingsButton />
    </SettingsProvider>
  )
}
