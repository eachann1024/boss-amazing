import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card'

export function SettingsPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      {children}
    </section>
  )
}

export function SettingsCard({ title, description, children, className }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn('space-y-3', !title && !description && 'pt-4')}>{children}</CardContent>
    </Card>
  )
}

export function SettingsRows({ children }: { children: ReactNode }) {
  return <Card className="overflow-hidden">{children}</Card>
}

export function SettingsLoading() {
  return <div className="animate-pulse text-sm text-muted-foreground">加载中...</div>
}

export function SettingsStack({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function SettingsField({ children }: { children: ReactNode }) {
  return <div className="space-y-1.5">{children}</div>
}

export function SettingsInline({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>
}

export function SettingsBetween({ left, right }: { left: ReactNode; right: ReactNode }) {
  return <div className="flex items-center justify-between">{left}{right}</div>
}

export function SettingsGridTwo({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

export function SettingsMuted({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
}

export function SettingsBullets({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{children}</ul>
}

export function SettingsWrap({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>
}

export function SettingsRow({
  title,
  description,
  action,
  last = false,
}: {
  title: string
  description?: string
  action: ReactNode
  last?: boolean
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4 px-4 py-3', !last && 'border-b border-border')}>
      <div className={cn(description ? 'space-y-0.5' : undefined)}>
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function SettingsModalShell({
  title,
  subtitle,
  onClose,
  sidebar,
  children,
  footer,
}: {
  title: string
  subtitle: string
  onClose: () => void
  sidebar: ReactNode
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-3 md:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card className="relative flex h-[min(90vh,860px)] w-[min(960px,97vw)] flex-col overflow-hidden rounded-xl border border-border shadow-2xl">
        {/* Header */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-2.5">
            <p className="text-base font-semibold text-foreground">{title}</p>
            <span className="text-muted-foreground/40">·</span>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="关闭设置"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 md:flex">
          {sidebar}
          <main className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-6 md:border-l md:border-border md:px-8 md:py-7">
            {children}
          </main>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-card px-6 py-3">
          {footer}
        </div>
      </Card>
    </div>
  )
}
