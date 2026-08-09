'use client'

import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getPasswordRequirements, getStrengthPassword } from '@/utils/regexUtils'
import { FormField } from '../FormField'

interface FormPasswordInputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  placeholder?: string
  disabled?: boolean
  showStrengthIndicator?: boolean
}

export function FormPasswordInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  showStrengthIndicator = false,
}: FormPasswordInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = (field.value as string) ?? ''
        const requirements = showStrengthIndicator ? getPasswordRequirements(value) : []
        const strength = showStrengthIndicator ? getStrengthPassword(value) : null
        const allMet = requirements.length > 0 && requirements.every((r) => r.test)
        const showPanel = showStrengthIndicator && isFocused && value.length > 0 && !allMet

        return (
          <FormField label={label} error={fieldState.error?.message} htmlFor={name}>
            <div className="relative">
              <Input
                id={name}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className={fieldState.error ? 'border-destructive pr-10' : 'pr-10'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false)
                  field.onBlur()
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {showPanel && (
              <div className="mt-1.5 rounded-md border border-border bg-popover p-3 shadow-md">
                <div className="space-y-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength?.strength === 100
                          ? 'bg-primary'
                          : (strength?.strength ?? 0) >= 60
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                      }`}
                      style={{ width: `${strength?.strength ?? 0}%` }}
                    />
                  </div>
                  <ul className="space-y-1">
                    {requirements.map((req) => (
                      <li
                        key={req.text}
                        className={`text-xs ${req.test ? 'text-primary' : 'text-gray-400'}`}
                      >
                        {req.test ? '✓' : '○'} {req.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </FormField>
        )
      }}
    />
  )
}
