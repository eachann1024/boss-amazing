import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Label } from '@/ui/components/label'
import { Input } from '@/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/components/select'
import { Button } from '@/ui/components/button'
import { useSettings } from '@/ui/settings/useSettings'
import {
  SettingsPage,
  SettingsCard,
  SettingsLoading,
  SettingsStack,
  SettingsField,
  SettingsInline,
  SettingsMuted,
} from '@/ui/components/settings-primitives'
import { PAGE_META } from '@/ui/settings/meta'

const OPENAI_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1']
const CLAUDE_MODELS = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022']

export function AiPanel() {
  const { settings, setSettings } = useSettings()
  const [showKey, setShowKey] = useState(false)
  const [tested, setTested] = useState(false)

  if (!settings) {
    return <SettingsLoading />
  }

  const modelOptions = settings.ai.provider === 'anthropic' ? CLAUDE_MODELS : OPENAI_MODELS

  return (
    <SettingsPage title={PAGE_META.ai.title} description={PAGE_META.ai.description}>
      <SettingsCard>
        <SettingsStack>
          <SettingsField>
            <Label>供应商</Label>
            <Select
              value={settings.ai.provider}
              onValueChange={(value) => {
                if (!value) return
                setSettings({
                  ...settings,
                  ai: { ...settings.ai, provider: value as typeof settings.ai.provider },
                })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="custom">自定义（OpenAI 兼容）</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>

          <SettingsField>
            <Label>模型</Label>
            <Select
              value={settings.ai.model}
              onValueChange={(value) => {
                if (!value) return
                setSettings({ ...settings, ai: { ...settings.ai, model: value } })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsField>

          <SettingsField>
            <Label>API Key</Label>
            <SettingsInline>
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={settings.ai.apiKey}
                  onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, apiKey: e.target.value } })}
                  className="pr-8"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setTested(true)}>
                {tested ? (
                  <span className="flex items-center gap-1 text-[oklch(0.54_0.16_155)]">
                    <CheckCircle2 className="size-3.5" />
                    已验证
                  </span>
                ) : (
                  '验证'
                )}
              </Button>
            </SettingsInline>
          </SettingsField>

          <SettingsField>
            <Label>API Base URL（可选）</Label>
            <Input
              placeholder="https://api.openai.com/v1"
              value={settings.ai.baseUrl || ''}
              onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, baseUrl: e.target.value } })}
            />
            <SettingsMuted>使用自定义或代理地址时填写</SettingsMuted>
          </SettingsField>
        </SettingsStack>
      </SettingsCard>

      <SettingsCard title="内置提示词">
        <SettingsMuted>
          系统已内置优化好的提示词，会根据你的简历和岗位信息自动生成打招呼语。无需手动配置 System Prompt。
        </SettingsMuted>
      </SettingsCard>
    </SettingsPage>
  )
}
