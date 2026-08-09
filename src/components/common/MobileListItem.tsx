import { cn } from '@/lib/utils'
import React from 'react'

interface MobileListItemProps {
  children: React.ReactNode
  leftBorderClassName?: string
  className?: string
}

export function MobileListItem({ children, leftBorderClassName, className }: MobileListItemProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-l-4 border-border bg-background p-4 shadow-sm',
        leftBorderClassName,
        className,
      )}
    >
      {children}
    </div>
  )
}
