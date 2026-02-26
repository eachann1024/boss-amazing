import { Send, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/ui/components/badge'
import {
  SettingsPage,
  SettingsCard,
  SettingsRows,
  SettingsRow,
  SettingsLoading,
  SettingsMuted,
  SettingsBetween,
} from '@/ui/components/settings-primitives'
import { useSettings } from '@/ui/settings/useSettings'
import { PAGE_META } from '@/ui/settings/meta'

export function StatsPanel() {
  const { stats } = useSettings()
  if (!stats) {
    return <SettingsLoading />
  }

  const cards = [
    { label: '累计投递', value: String(stats.sent), icon: Send, color: 'text-primary' },
    { label: '已过滤', value: String(stats.filtered), icon: XCircle, color: 'text-muted-foreground' },
    { label: '失败', value: String(stats.failed), icon: Clock, color: 'text-[oklch(0.72_0.17_55)]' },
    { label: '总处理', value: String(stats.total), icon: CheckCircle2, color: 'text-[oklch(0.54_0.16_155)]' },
  ]

  const reasonEntries = Object.entries(stats.reasons || {}).sort((a, b) => b[1] - a[1])

  return (
    <SettingsPage title={PAGE_META.stats.title} description={PAGE_META.stats.description}>
      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <SettingsCard key={card.label} title={card.label}>
              <SettingsBetween
                left={<p className={`text-2xl font-semibold ${card.color}`}>{card.value}</p>}
                right={<Icon className={`size-4 ${card.color}`} />}
              />
            </SettingsCard>
          )
        })}
      </div>

      <SettingsCard title="过滤原因">
        {reasonEntries.length === 0 ? (
          <SettingsMuted>暂无数据</SettingsMuted>
        ) : (
          <SettingsRows>
            {reasonEntries.map(([reason, count], idx) => (
              <SettingsRow
                key={reason}
                title={reason}
                last={idx === reasonEntries.length - 1}
                action={<Badge variant="secondary">{count}</Badge>}
              />
            ))}
          </SettingsRows>
        )}
      </SettingsCard>
    </SettingsPage>
  )
}
