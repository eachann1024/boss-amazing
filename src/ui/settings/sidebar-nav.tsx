import { cn } from '@/shared/cn'
import { SETTINGS_NAV } from '@/ui/settings/meta'

const GROUPS = Array.from(new Set(SETTINGS_NAV.map((item) => item.group)))

export function SidebarNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <aside className="shrink-0 border-b border-border bg-card md:w-[220px] md:border-b-0 md:border-r md:border-border">
      <nav className="flex gap-2 overflow-x-auto px-3 py-4 md:block md:overflow-x-visible md:px-3 md:py-5">
        {GROUPS.map((group) => (
          <section key={group} className="min-w-[160px] md:mb-5 md:min-w-0 md:last:mb-0">
            <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {group}
            </p>
            <div className="space-y-0.5">
              {SETTINGS_NAV.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/8 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className={cn('size-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  )
}
