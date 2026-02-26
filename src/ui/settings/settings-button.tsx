import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Download, RotateCcw, Settings, Upload } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { SidebarNav } from '@/ui/settings/sidebar-nav'
import { BasicFilterPanel } from '@/ui/settings/basic-filter-panel'
import { SalaryPanel } from '@/ui/settings/salary-panel'
import { AiPanel } from '@/ui/settings/ai-panel'
import { ResumePanel } from '@/ui/settings/resume-panel'
import { GreetingPanel } from '@/ui/settings/greeting-panel'
import { StatsPanel } from '@/ui/settings/stats-panel'
import { RunPanel } from '@/ui/settings/run-panel'
import { useSettings } from '@/ui/settings/useSettings'
import { SettingsModalShell } from '@/ui/components/settings-primitives'
import { DEFAULT_SETTINGS } from '@/shared/defaults'
import { normalizeSettings } from '@/shared/storage'
import type { Settings as SettingsType } from '@/shared/types'

const PANELS: Record<string, ReactNode> = {
  basic: <BasicFilterPanel />,
  salary: <SalaryPanel />,
  ai: <AiPanel />,
  resume: <ResumePanel />,
  greeting: <GreetingPanel />,
  run: <RunPanel />,
  stats: <StatsPanel />,
}

function cloneSettings(settings: SettingsType) {
  return JSON.parse(JSON.stringify(settings)) as SettingsType
}

function downloadJson(data: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState('basic')
  const [notice, setNotice] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { settings, setSettings, save } = useSettings()
  const [baseline, setBaseline] = useState<string | null>(null)

  const hasSettings = Boolean(settings)
  const dirty = useMemo(() => {
    if (!settings || baseline === null) return false
    return JSON.stringify(settings) !== baseline
  }, [settings, baseline])

  useEffect(() => {
    if (settings && baseline === null) {
      setBaseline(JSON.stringify(settings))
    }
  }, [settings, baseline])

  const rollbackAndClose = useCallback(() => {
    if (settings && baseline) {
      setSettings(cloneSettings(JSON.parse(baseline) as SettingsType))
    }
    onClose()
  }, [baseline, onClose, setSettings, settings])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        rollbackAndClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [rollbackAndClose])

  const handleSave = async () => {
    await save()
    if (settings) {
      setBaseline(JSON.stringify(settings))
    }
    setNotice('设置已保存')
    setTimeout(() => setNotice(null), 1600)
    onClose()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="application/json"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return
          try {
            const text = await file.text()
            const parsed = JSON.parse(text)
            setSettings(normalizeSettings(parsed))
            setNotice(`导入成功：${file.name}`)
          }
          catch {
            setNotice('导入失败：JSON 格式不正确')
          }
          event.target.value = ''
        }}
      />

      <SettingsModalShell
        title="Boss Awesome"
        subtitle={dirty ? '设置中心（未保存）' : '设置中心'}
        onClose={rollbackAndClose}
        sidebar={<SidebarNav active={active} onSelect={setActive} />}
        footer={
          <div className="flex w-full items-center gap-2">
            <Button variant="ghost" size="sm" disabled={!hasSettings} onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-3.5" />
              导入
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasSettings}
              onClick={() => {
                if (!settings) return
                downloadJson(settings, 'boss-awesome-settings.json')
                setNotice('配置已导出')
              }}
            >
              <Download className="size-3.5" />
              导出
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasSettings}
              onClick={() => {
                setSettings(cloneSettings(DEFAULT_SETTINGS))
                setNotice('已恢复默认配置（未保存）')
              }}
            >
              <RotateCcw className="size-3.5" />
              恢复默认
            </Button>

            <div className="ml-auto flex items-center gap-2">
              {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
              <Button variant="outline" size="sm" onClick={rollbackAndClose}>
                取消
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!hasSettings}>
                保存设置
              </Button>
            </div>
          </div>
        }
      >
        {PANELS[active]}
      </SettingsModalShell>
    </>
  )
}

export function SettingsButton({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <>
      <div className="pointer-events-auto fixed right-4 top-4 z-[9999] md:right-6 md:top-5">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Settings className="size-4" />
          设置
        </Button>
      </div>

      {open && <SettingsModal onClose={() => setOpen(false)} />}
    </>
  )
}
