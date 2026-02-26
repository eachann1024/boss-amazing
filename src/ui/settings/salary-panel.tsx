import { Label } from '@/ui/components/label'
import { Input } from '@/ui/components/input'
import { Slider } from '@/ui/components/slider'
import { useSettings } from '@/ui/settings/useSettings'
import {
  SettingsPage,
  SettingsCard,
  SettingsLoading,
  SettingsMuted,
  SettingsGridTwo,
  SettingsField,
  SettingsBetween,
} from '@/ui/components/settings-primitives'
import { PAGE_META } from '@/ui/settings/meta'

export function SalaryPanel() {
  const { settings, setSettings } = useSettings()
  if (!settings) {
    return <SettingsLoading />
  }

  const range = [settings.salaryRange.minK, settings.salaryRange.maxK]

  return (
    <SettingsPage title={PAGE_META.salary.title} description={PAGE_META.salary.description}>
      <SettingsCard title="薪资范围" description={`${range[0]}K - ${range[1]}K`}>
        <Slider
          min={5}
          max={100}
          step={1}
          value={range}
          onValueChange={(val) => {
            if (!Array.isArray(val)) return
            setSettings({
              ...settings,
              salaryRange: {
                ...settings.salaryRange,
                minK: val[0],
                maxK: val[1],
                enabled: true,
              },
            })
          }}
        />
        <SettingsBetween
          left={<span className="text-xs text-muted-foreground">5K</span>}
          right={<span className="text-xs text-muted-foreground">100K+</span>}
        />
      </SettingsCard>

      <SettingsCard>
        <SettingsGridTwo>
          <SettingsField>
            <Label className="text-xs text-muted-foreground">最低薪资（K）</Label>
            <Input
              type="number"
              value={range[0]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  salaryRange: {
                    ...settings.salaryRange,
                    minK: Number(e.target.value),
                    enabled: true,
                  },
                })
              }
            />
          </SettingsField>
          <SettingsField>
            <Label className="text-xs text-muted-foreground">最高薪资（K）</Label>
            <Input
              type="number"
              value={range[1]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  salaryRange: {
                    ...settings.salaryRange,
                    maxK: Number(e.target.value),
                    enabled: true,
                  },
                })
              }
            />
          </SettingsField>
        </SettingsGridTwo>
      </SettingsCard>

      <SettingsCard>
        <SettingsMuted>
          薪资范围基于岗位标注的薪资信息进行过滤。若岗位为“面议”或未标注薪资，默认不过滤。
        </SettingsMuted>
      </SettingsCard>
    </SettingsPage>
  )
}
