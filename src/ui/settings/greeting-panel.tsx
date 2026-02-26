import { Label } from '@/ui/components/label'
import { Textarea } from '@/ui/components/textarea'
import { Badge } from '@/ui/components/badge'
import { Switch } from '@/ui/components/switch'
import { useSettings } from '@/ui/settings/useSettings'
import {
  SettingsPage,
  SettingsCard,
  SettingsLoading,
  SettingsWrap,
  SettingsField,
  SettingsBetween,
  SettingsMuted,
  SettingsBullets,
} from '@/ui/components/settings-primitives'
import { GREETING_VARIABLES, PAGE_META } from '@/ui/settings/meta'

export function GreetingPanel() {
  const { settings, setSettings } = useSettings()
  if (!settings) {
    return <SettingsLoading />
  }

  return (
    <SettingsPage title={PAGE_META.greeting.title} description={PAGE_META.greeting.description}>
      <SettingsCard title="可用变量">
        <SettingsWrap>
          {GREETING_VARIABLES.map((v) => (
            <Badge key={v.name} variant="secondary" className="gap-1 px-2 py-1 text-xs font-normal">
              <code className="font-mono text-primary">{v.name}</code>
              <span className="text-muted-foreground">{v.desc}</span>
            </Badge>
          ))}
        </SettingsWrap>
      </SettingsCard>

      <SettingsCard>
        <SettingsField>
          <SettingsBetween left={<Label>模板内容</Label>} right={<Badge variant="secondary">AI 增强</Badge>} />
          <Textarea
            value={settings.greeting.template}
            onChange={(e) => setSettings({ ...settings, greeting: { ...settings.greeting, template: e.target.value } })}
            className="min-h-[200px] resize-none"
          />
          <SettingsMuted>AI 会在此模板基础上，结合你的简历与岗位 JD 补充关键匹配点</SettingsMuted>
        </SettingsField>
      </SettingsCard>

      <SettingsCard title="启用变量渲染">
        <SettingsBetween
          left={<p className="text-sm text-muted-foreground">变量仅用于本地模板渲染，AI 提示词仍为系统内置。</p>}
          right={
            <Switch
              checked={settings.greeting.useVariables}
              onCheckedChange={(value) => setSettings({ ...settings, greeting: { ...settings.greeting, useVariables: value } })}
            />
          }
        />
      </SettingsCard>

      <SettingsCard title="注意事项">
        <SettingsBullets>
          <li>请以“您好，看到贵司”开头，直接切入主题</li>
          <li>不要哀求、不要高傲，不卑不亢</li>
          <li>模板字数建议 100-200 字，AI 会自动适配</li>
        </SettingsBullets>
      </SettingsCard>
    </SettingsPage>
  )
}
