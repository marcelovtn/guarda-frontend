'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  /** A button, usually the action that fills the emptiness. */
  action?: ReactNode
  /** Dashed outline, for a drop target like the empty track builder. */
  outlined?: boolean
  className?: string
}

/** Shown wherever a list can legitimately be empty. */
export function EmptyState({
  title,
  description,
  action,
  outlined = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg px-6 py-12 text-center',
        outlined ? 'border border-dashed border-border' : 'bg-card',
        className,
      )}
    >
      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{title}</h3>

      {description ? (
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
