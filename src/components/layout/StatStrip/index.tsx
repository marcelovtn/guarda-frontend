'use client'

import { cn } from '@/lib/utils'

export interface StatItem {
  value: string
  label: string
}

interface StatStripProps {
  items: StatItem[]
  /** Light-on-dark, for the auth panel. */
  onDark?: boolean
  className?: string
}

/**
 * A row of numbers with their labels underneath.
 *
 * Used on the instructor profile and the profile editor. Deliberately holds
 * only content metrics — lessons, tracks, last published — since student
 * counts were taken out of the product.
 */
export function StatStrip({ items, onDark = false, className }: StatStripProps) {
  return (
    <dl className={cn('flex flex-wrap items-start gap-x-12 gap-y-4', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <dt className="sr-only">{item.label}</dt>
          <dd
            className={cn(
              'font-display text-lg font-bold tracking-tight',
              onDark ? 'text-white' : 'text-foreground',
            )}
          >
            {item.value}
          </dd>
          <p className={cn('text-xs', onDark ? 'text-white/55' : 'text-muted-foreground')}>
            {item.label}
          </p>
        </div>
      ))}
    </dl>
  )
}
