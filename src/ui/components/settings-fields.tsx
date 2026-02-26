import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Label } from '@/ui/components/label'
import { Input } from '@/ui/components/input'
import { Badge } from '@/ui/components/badge'
import { Button } from '@/ui/components/button'
import { Switch } from '@/ui/components/switch'
import { SettingsRows, SettingsRow } from '@/ui/components/settings-primitives'

export function TagEditor({
  label,
  description,
  values,
  onChange,
}: {
  label: string
  description: string
  values: string[]
  onChange: (values: string[]) => void
}) {
  const [value, setValue] = useState('')

  const add = () => {
    const v = value.trim()
    if (v && !values.includes(v)) {
      onChange([...values, v])
      setValue('')
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 p-2">
        {values.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1.5 px-3 py-1 text-sm font-normal">
            {tag}
            <button
              onClick={() => onChange(values.filter((t) => t !== tag))}
              className="rounded-full text-muted-foreground hover:text-destructive"
              aria-label={`删除 ${tag}`}
            >
              <X className="size-3.5" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault()
              add()
            }
          }}
          placeholder="输入关键词后按回车"
        />
        <Button size="icon" variant="outline" onClick={add}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export type ToggleRow = {
  key: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

export function ToggleRows({ rows }: { rows: ToggleRow[] }) {
  return (
    <SettingsRows>
      {rows.map((row, idx) => (
        <SettingsRow
          key={row.key}
          title={row.label}
          description={row.description}
          last={idx === rows.length - 1}
          action={<Switch checked={row.checked} onCheckedChange={row.onChange} />}
        />
      ))}
    </SettingsRows>
  )
}
