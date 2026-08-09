'use client'

import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { useFormDisabled } from '../FormDisabledContext'

interface FormCheckboxProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label: string
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  control,
  label,
}: FormCheckboxProps<TFieldValues>) {
  const contextDisabled = useFormDisabled()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1.5">
          <label
            htmlFor={name}
            className="flex cursor-pointer items-center gap-3 text-sm font-medium"
          >
            <Checkbox
              id={name}
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={contextDisabled}
            />
            {label}
          </label>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
