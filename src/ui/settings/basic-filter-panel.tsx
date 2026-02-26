import { useSettings } from '@/ui/settings/useSettings'
import { SettingsPage, SettingsCard, SettingsLoading } from '@/ui/components/settings-primitives'
import { TagEditor, ToggleRows } from '@/ui/components/settings-fields'
import { FILTER_SWITCH_META, KEYWORD_FILTER_META, PAGE_META } from '@/ui/settings/meta'

export function BasicFilterPanel() {
  const { settings, setSettings } = useSettings()
  if (!settings) {
    return <SettingsLoading />
  }

  return (
    <SettingsPage title={PAGE_META.basic.title} description={PAGE_META.basic.description}>
      <SettingsCard>
        <TagEditor
          label={KEYWORD_FILTER_META.jobTitle.label}
          description={KEYWORD_FILTER_META.jobTitle.description}
          values={settings.jobTitleFilter.values}
          onChange={(values) =>
            setSettings({
              ...settings,
              jobTitleFilter: { ...settings.jobTitleFilter, values, enabled: true },
            })
          }
        />
        <TagEditor
          label={KEYWORD_FILTER_META.jobContent.label}
          description={KEYWORD_FILTER_META.jobContent.description}
          values={settings.jobContentFilter.values}
          onChange={(values) =>
            setSettings({
              ...settings,
              jobContentFilter: { ...settings.jobContentFilter, values, enabled: true },
            })
          }
        />
      </SettingsCard>

      <SettingsCard title="过滤开关">
        <ToggleRows
          rows={FILTER_SWITCH_META.map((row) => ({
            key: row.key,
            label: row.label,
            description: row.description,
            checked: settings.filters[row.key],
            onChange: (value) =>
              setSettings({
                ...settings,
                filters: { ...settings.filters, [row.key]: value },
              }),
          }))}
        />
      </SettingsCard>
    </SettingsPage>
  )
}
