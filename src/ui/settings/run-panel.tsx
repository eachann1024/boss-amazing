import { Button } from '@/ui/components/button'
import { Badge } from '@/ui/components/badge'
import { useAutoRunner } from '@/entrypoints/content/useAutoRunner'
import {
  SettingsPage,
  SettingsCard,
  SettingsBetween,
  SettingsInline,
  SettingsMuted,
} from '@/ui/components/settings-primitives'
import { PAGE_META } from '@/ui/settings/meta'

export function RunPanel() {
  const { state, start, stop } = useAutoRunner()

  return (
    <SettingsPage title={PAGE_META.run.title} description={PAGE_META.run.description}>
      <SettingsCard title="当前状态" description={state.message || (state.running ? '运行中' : '待机')}>
        <SettingsBetween
          left={<Badge variant={state.running ? 'default' : 'secondary'}>{state.running ? '运行中' : '待机'}</Badge>}
          right={<span className="text-xs text-muted-foreground">进度：{state.currentIndex}/{state.total}</span>}
        />
        <SettingsInline>
          <Button onClick={start} disabled={state.running} size="sm">
            开始投递
          </Button>
          <Button onClick={stop} disabled={!state.running} variant="outline" size="sm">
            暂停
          </Button>
        </SettingsInline>
      </SettingsCard>

      <SettingsCard>
        <SettingsMuted>
          逻辑：先做关键词与条件过滤，再做 AI 匹配评分，然后生成打招呼语并自动发送。
        </SettingsMuted>
      </SettingsCard>
    </SettingsPage>
  )
}
