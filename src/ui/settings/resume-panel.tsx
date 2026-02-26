import { FileText } from 'lucide-react'
import { Label } from '@/ui/components/label'
import { Textarea } from '@/ui/components/textarea'
import { Button } from '@/ui/components/button'
import { useSettings } from '@/ui/settings/useSettings'
import { SettingsPage, SettingsCard, SettingsLoading, SettingsInline } from '@/ui/components/settings-primitives'
import { PAGE_META } from '@/ui/settings/meta'

export function ResumePanel() {
  const { settings, setSettings } = useSettings()
  if (!settings) {
    return <SettingsLoading />
  }

  return (
    <SettingsPage title={PAGE_META.resume.title} description={PAGE_META.resume.description}>
      <SettingsCard title="简历正文" description="支持 Markdown / Properties 格式" className="h-full">
        <Textarea
          value={settings.resume}
          onChange={(e) => setSettings({ ...settings, resume: e.target.value })}
          placeholder="粘贴你的简历内容..."
          className="min-h-[280px] font-mono text-xs leading-relaxed"
        />
        <SettingsInline>
          <Button variant="outline" size="sm" disabled>
            <FileText className="size-3.5" />
            从文件导入
          </Button>
          <Button size="sm" className="ml-auto">
            保存简历
          </Button>
        </SettingsInline>
      </SettingsCard>
    </SettingsPage>
  )
}
