import { useCallback, useRef, useState } from 'react'
import { Database, FileText, Save } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { BlocknoteMarkdownEditor } from '@/ui/components/blocknote-markdown-editor'
import { useSettings } from '@/ui/settings/useSettings'
import { SettingsPage, SettingsCard, SettingsLoading, SettingsInline } from '@/ui/components/settings-primitives'
import { PAGE_META } from '@/ui/settings/meta'
import { loadBossResumeMarkdown } from '@/shared/resume'

export function ResumePanel() {
  const { settings, setSettings, save } = useSettings()
  const [notice, setNotice] = useState<string | null>(null)
  const [loadingBossResume, setLoadingBossResume] = useState(false)
  const [loadToken, setLoadToken] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateResume = useCallback((resume: string, message?: string) => {
    setSettings((prev) => {
      if (!prev) return prev
      return { ...prev, resume }
    })
    setLoadToken(prev => prev + 1)
    if (message) {
      setNotice(message)
    }
  }, [setSettings])

  const importFromBoss = useCallback(async (silent = false) => {
    try {
      setLoadingBossResume(true)
      const markdown = await loadBossResumeMarkdown()
      updateResume(markdown, silent ? undefined : '已读取 Boss 简历')
    }
    catch (error: any) {
      if (!silent) {
        setNotice(`读取失败：${error?.message || '请先登录 Boss 账号'}`)
      }
    }
    finally {
      setLoadingBossResume(false)
    }
  }, [updateResume])

  if (!settings) {
    return <SettingsLoading />
  }

  return (
    <SettingsPage title={PAGE_META.resume.title} description={PAGE_META.resume.description}>
      <SettingsCard title="简历正文" description="使用富文本编辑器，支持 Markdown 与结构化编辑" className="h-full">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (!file) return
            try {
              const text = await file.text()
              updateResume(text, `导入成功：${file.name}`)
            }
            catch {
              setNotice('导入失败：文件读取错误')
            }
            event.target.value = ''
          }}
        />

        <BlocknoteMarkdownEditor
          markdown={settings.resume}
          loadToken={loadToken}
          onMarkdownChange={(value) => {
            setSettings((prev) => {
              if (!prev) return prev
              return { ...prev, resume: value }
            })
          }}
        />

        <SettingsInline>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <FileText className="size-3.5" />
            从文件导入
          </Button>
          <Button variant="outline" size="sm" onClick={() => void importFromBoss()} disabled={loadingBossResume}>
            <Database className="size-3.5" />
            {loadingBossResume ? '读取中...' : '从 Boss 读取'}
          </Button>
          <Button
            size="sm"
            className="ml-auto"
            onClick={async () => {
              await save()
              setNotice('简历已保存')
            }}
          >
            <Save className="size-3.5" />
            保存简历
          </Button>
        </SettingsInline>
        {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
      </SettingsCard>
    </SettingsPage>
  )
}
