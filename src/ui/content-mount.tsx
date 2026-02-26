import React from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from '@/ui/settings/useSettings'
import { SettingsButton } from '@/ui/settings/settings-button'
import { PortalContainerProvider } from '@/ui/components/portal-container'
import contentStyles from '@/entrypoints/content/style.css?inline'

const HOST_ID = 'boss-awesome-host'
const ROOT_ID = 'boss-awesome-root'
const PORTAL_ID = 'boss-awesome-portal'

function ContentApp({ rootContainer }: { rootContainer: HTMLElement }) {
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)

  return (
    <PortalContainerProvider container={portalContainer ?? rootContainer}>
      <SettingsProvider>
        <SettingsButton />
        <div id={PORTAL_ID} ref={setPortalContainer} />
      </SettingsProvider>
    </PortalContainerProvider>
  )
}

export async function mountContentUI() {
  if (document.getElementById(HOST_ID)) return
  const host = document.createElement('div')
  host.id = HOST_ID
  const shadowRoot = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = contentStyles
  shadowRoot.appendChild(style)

  const container = document.createElement('div')
  container.id = ROOT_ID
  shadowRoot.appendChild(container)
  document.documentElement.appendChild(host)

  const root = createRoot(container)
  root.render(<ContentApp rootContainer={container} />)
}
