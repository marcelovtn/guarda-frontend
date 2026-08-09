import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { FormField } from '../FormField'
import { useFormDisabled } from '../FormDisabledContext'

interface FormInputProps<TFieldValues extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name'
> {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  required?: boolean
}

export function FormInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  const contextDisabled = useFormDisabled()
  const isDisabled = contextDisabled || disabled

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField
          label={label}
          error={fieldState.error?.message}
          htmlFor={name}
          required={required}
        >
          <Input
            id={name}
            {...field}
            {...inputProps}
            readOnly={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            onBlur={isDisabled ? undefined : field.onBlur}
            className={cn(
              fieldState.error ? 'border-destructive' : undefined,
              isDisabled &&
                'opacity-60 focus-visible:border-input focus-visible:ring-0 focus-visible:ring-offset-0',
            )}
          />
        </FormField>
      )}
    />
  )
}
