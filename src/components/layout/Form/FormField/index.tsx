import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label?: string
  error?: string
  htmlFor?: string
  className?: string
  children: ReactNode
  required?: boolean
}

export function FormField({
  label,
  error,
  htmlFor,
  className,
  children,
  required,
}: FormFieldProps) {
  return (
    // min-w-0 so a field inside a grid or flex row can shrink below the
    // intrinsic width of its content — a select trigger sets whitespace-nowrap,
    // and a long option name would otherwise push the whole column wider than
    // the screen.
    <div className={cn('min-w-0 space-y-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
