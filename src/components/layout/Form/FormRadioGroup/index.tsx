'use client'

import { Controller, useFormContext } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormField } from '../FormField'
import { useFormDisabled } from '../FormDisabledContext'
import { cn } from '@/lib/utils'

interface FormRadioGroupProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  options: { value: string; label: string }[]
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function FormRadioGroup<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled,
  orientation = 'horizontal',
}: FormRadioGroupProps<TFieldValues>) {
  const contextDisabled = useFormDisabled()
  const isDisabled = contextDisabled || disabled
  // useFormContext returns null outside a FormProvider, and the documented way
  // to use these fields is to pass `control` directly. Destructuring it blindly
  // crashed the whole form. FormSelect already guards it the same way.
  const formContext = useFormContext()
  const clearErrors = formContext?.clearErrors
  const directionClass =
    orientation === 'vertical' ? 'flex flex-col gap-2' : 'flex flex-row flex-wrap gap-2'

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <RadioGroup
            value={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value)
              if (value) clearErrors(name as string)
            }}
            disabled={isDisabled}
            className={directionClass}
          >
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'flex min-h-11 min-w-16 cursor-pointer select-none items-center justify-center rounded-full border-2 px-5 text-sm font-medium transition-colors',
                  field.value === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-foreground hover:border-primary/50 hover:bg-muted/50',
                  isDisabled && 'cursor-default opacity-60',
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                  disabled={isDisabled}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </FormField>
      )}
    />
  )
}
