import { useCallback, useEffect, useMemo, useState } from 'react'
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

type ListModelsResponse = {
  ok?: boolean
  models?: string[]
  error?: string
}

export function AiPanel() {
  const { settings, setSettings } = useSettings()
  const [showKey, setShowKey] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [loadingModels, setLoadingModels] = useState(false)
  const [remoteModels, setRemoteModels] = useState<string[]>([])
  const [modelHint, setModelHint] = useState<string | null>(null)

  useEffect(() => {
    if (!settings) return
    setVerifyResult(null)
  }, [settings?.ai.provider, settings?.ai.model, settings?.ai.apiKey, settings?.ai.baseUrl])

  useEffect(() => {
    setRemoteModels([])
    setModelHint(null)
  }, [settings?.ai.provider, settings?.ai.baseUrl, settings?.ai.apiKey])

  const provider = settings?.ai.provider ?? 'openai'
  const currentModel = settings?.ai.model ?? OPENAI_MODELS[0]
  const fallbackModels = provider === 'anthropic' ? CLAUDE_MODELS : OPENAI_MODELS
  const modelOptions = useMemo(() => {
    const source = remoteModels.length > 0 ? remoteModels : fallbackModels
    if (!source.includes(currentModel)) {
      return [currentModel, ...source]
    }
    return source
  }, [currentModel, fallbackModels, remoteModels])

  const canFetchModels = Boolean(settings?.ai.apiKey?.trim())

  const fetchModelOptions = useCallback(() => {
    if (!canFetchModels) return
    setLoadingModels(true)
    setModelHint(null)
    chrome.runtime.sendMessage({ type: 'ai:list-models' }, (response: ListModelsResponse) => {
      const err = chrome.runtime.lastError
      if (err) {
        setModelHint(err.message || '模型列表获取失败')
        setLoadingModels(false)
        return
      }
      if (!response?.ok) {
        setModelHint(response?.error || '模型列表获取失败')
        setLoadingModels(false)
        return
      }
      const models = Array.isArray(response.models) ? response.models.filter(Boolean) : []
      setRemoteModels(models)
      setModelHint(models.length > 0 ? `已获取 ${models.length} 个模型` : '接口未返回可用模型，已使用内置列表')
      setLoadingModels(false)
    })
  }, [canFetchModels])

  if (!settings) {
    return <SettingsLoading />
  }

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
            <div className="flex items-center justify-between gap-2">
              <Label>模型</Label>
              <Button
                variant="outline"
                size="sm"
                disabled={!canFetchModels || loadingModels}
                onClick={fetchModelOptions}
              >
                {loadingModels ? '拉取中...' : '拉取模型列表'}
              </Button>
            </div>
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
            <SettingsMuted>{modelHint || '填写接口密钥后可通过接口拉取模型列表。'}</SettingsMuted>
          </SettingsField>

          <SettingsField>
            <Label>匹配阈值（0-100）</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.ai.scoreThreshold}
              onChange={(e) => {
                const score = Number(e.target.value)
                setSettings({
                  ...settings,
                  ai: {
                    ...settings.ai,
                    scoreThreshold: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : settings.ai.scoreThreshold,
                  },
                })
              }}
            />
            <SettingsMuted>AI 评分低于该阈值时自动过滤。</SettingsMuted>
          </SettingsField>

          <SettingsField>
            <Label>接口密钥</Label>
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
              <Button
                variant="outline"
                size="sm"
                disabled={verifying || !settings.ai.apiKey}
                onClick={() => {
                  setVerifying(true)
                  chrome.runtime.sendMessage({ type: 'ai:verify' }, (response) => {
                    const err = chrome.runtime.lastError
                    if (err) {
                      setVerifyResult({ ok: false, text: err.message || '验证失败' })
                      setVerifying(false)
                      return
                    }
                    if (response?.ok) {
                      setVerifyResult({ ok: true, text: '已验证' })
                    }
                    else {
                      setVerifyResult({ ok: false, text: response?.error || '验证失败' })
                    }
                    setVerifying(false)
                  })
                }}
              >
                {verifying ? '验证中...' : verifyResult?.ok ? (
                  <span className="flex items-center gap-1 text-[oklch(0.54_0.16_155)]">
                    <CheckCircle2 className="size-3.5" />
                    {verifyResult.text}
                  </span>
                ) : (
                  verifyResult?.text || '验证'
                )}
              </Button>
            </SettingsInline>
            {verifyResult && !verifyResult.ok ? <SettingsMuted>{verifyResult.text}</SettingsMuted> : null}
          </SettingsField>

          <SettingsField>
            <Label>接口地址（可选）</Label>
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
          系统已内置优化好的提示词，会根据你的简历和岗位信息自动生成打招呼语。无需手动配置系统提示词。
        </SettingsMuted>
      </SettingsCard>
    </SettingsPage>
  )
}
