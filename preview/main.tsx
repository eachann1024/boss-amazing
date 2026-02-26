import React from 'react'
import ReactDOM from 'react-dom/client'
import { SettingsButton } from '@/ui/settings/settings-button'
import { SettingsProvider } from '@/ui/settings/useSettings'
import './preview.css'

function App() {
  return (
    <SettingsProvider>
      <div
        id="boss-helper-lite-root"
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        <SettingsButton defaultOpen />
      </div>
    </SettingsProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
