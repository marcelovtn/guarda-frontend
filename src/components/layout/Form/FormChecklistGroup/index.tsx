'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { Control } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import { useFormDisabled } from '../FormDisabledContext'

interface FormChecklistGroupProps {
  control: Control<any>
  name: string
  label: string
  items: string[]
}

export function FormChecklistGroup({ control, name, label, items }: FormChecklistGroupProps) {
  const isDisabled = useFormDisabled()
  const { field, fieldState } = useController({ control, name, defaultValue: [] })
  const { trigger } = useFormContext()
  const checked: number[] = Array.isArray(field.value) ? field.value : []

  function toggle(idx: number) {
    if (isDisabled) return
    const next = checked.includes(idx) ? checked.filter((i) => i !== idx) : [...checked, idx]
    field.onChange(next)
    if (fieldState.error) trigger(name)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item, idx) => (
          <label
            key={idx}
            className={cn(
              'flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm transition-colors',
              checked.includes(idx)
                ? 'border-primary/40 bg-primary/5'
                : 'border-border hover:border-muted-foreground/40',
              isDisabled && 'cursor-default opacity-60',
            )}
          >
            <Checkbox
              checked={checked.includes(idx)}
              onCheckedChange={() => toggle(idx)}
              disabled={isDisabled}
              className="mt-0.5 shrink-0"
            />
            <span className="leading-snug">{item}</span>
          </label>
        ))}
      </div>
      {fieldState.error && <p className="text-sm text-destructive">{fieldState.error?.message}</p>}
    </div>
  )
}
