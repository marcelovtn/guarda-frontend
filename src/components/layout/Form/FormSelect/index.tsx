'use client'

import { Controller, useFormContext } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { FormField } from '../FormField'
import { useFormDisabled } from '../FormDisabledContext'

export interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
}

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = 'Selecione...',
  disabled,
}: FormSelectProps<TFieldValues>) {
  const contextDisabled = useFormDisabled()
  const formContext = useFormContext()
  const clearErrors = formContext?.clearErrors

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <Select
            value={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value)
              if (value) clearErrors?.(name as string)
            }}
            disabled={contextDisabled || disabled}
          >
            <SelectTrigger
              className={cn(
                // Ellipsis instead of overflow when the option name is long.
                '[&>span]:truncate',
                fieldState.error && 'border-destructive',
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  )
}
