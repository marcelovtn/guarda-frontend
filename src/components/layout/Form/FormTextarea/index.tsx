import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import type { TextareaHTMLAttributes } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { FormField } from '../FormField'
import { useFormDisabled } from '../FormDisabledContext'

interface FormTextareaProps<TFieldValues extends FieldValues> extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'name'
> {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  required?: boolean
}

export function FormTextarea<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  ...textareaProps
}: FormTextareaProps<TFieldValues>) {
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
          <Textarea
            id={name}
            {...field}
            {...textareaProps}
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
