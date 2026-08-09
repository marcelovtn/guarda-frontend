import { Button } from '@/components/ui/button'
import React from 'react'
import type { ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean
  label?: string
  loadingText?: string
}

export function SubmitButton({
  isLoading = false,
  label = 'Enviar',
  loadingText = 'Carregando...',
  className = '',
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={`w-full ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children || label
      )}
    </Button>
  )
}
