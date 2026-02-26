import { createContext, useContext, type ReactNode } from 'react'

type PortalContainer = HTMLElement | ShadowRoot | null

const PortalContainerContext = createContext<PortalContainer>(null)

export function PortalContainerProvider({
  container,
  children,
}: {
  container: PortalContainer
  children: ReactNode
}) {
  return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>
}

export function usePortalContainer(): PortalContainer {
  return useContext(PortalContainerContext)
}
