import { cn } from '@/shared/cn'
import { Button } from '@/ui/components/button'
import { SETTINGS_NAV } from '@/ui/settings/meta'

const GROUPS = Array.from(new Set(SETTINGS_NAV.map((item) => item.group)))

export function SidebarNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <aside className="shrink-0 border-b border-border bg-background/65 md:w-[252px] md:border-b-0">
      <div className="flex gap-4 overflow-x-auto px-3 py-3 md:block md:space-y-5 md:overflow-x-visible md:px-3 md:py-4">
        {GROUPS.map((group) => (
          <section key={group} className="min-w-[180px] md:min-w-0">
            <p className="mb-2 px-1 text-[11px] font-semibold tracking-wide text-muted-foreground">{group}</p>
            <div className="space-y-1">
              {SETTINGS_NAV.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon
                const isActive = active === item.id
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => onSelect(item.id)}
                    className={cn('w-full justify-start gap-2', isActive && 'border border-border')}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}
