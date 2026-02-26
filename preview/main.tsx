import React from 'react'
import ReactDOM from 'react-dom/client'
import { SettingsButton } from '@/ui/settings/settings-button'
import { SettingsProvider } from '@/ui/settings/useSettings'
import { PortalContainerProvider } from '@/ui/components/portal-container'
import './preview.css'

function App() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)

  return (
    <SettingsProvider>
      <PortalContainerProvider container={portalContainer ?? rootRef.current}>
        <div
          id="boss-awesome-root"
          ref={rootRef}
          style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        >
          <SettingsButton defaultOpen />
          <div id="boss-awesome-portal" ref={setPortalContainer} />
        </div>
      </PortalContainerProvider>
    </SettingsProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
