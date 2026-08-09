'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  /** 0–100. */
  percent: number
  /** Shows the number to the right of the bar, as the home cards do. */
  showPercent?: boolean
  /** Dark variant, for use over the video thumbnail on the hero. */
  onDark?: boolean
  className?: string
}

/**
 * The thin progress line under a track card and over the hero thumbnail.
 *
 * Separate from ui/progress because that primitive is a rounded Radix bar with
 * its own sizing; this one is a 4px rule that has to sit flush inside a card
 * and on top of a video frame.
 */
export function ProgressBar({
  percent,
  showPercent = false,
  onDark = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)))

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'h-1 flex-1 overflow-hidden rounded-full',
          onDark ? 'bg-white/25' : 'bg-secondary',
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>

      {showPercent ? (
        <span
          className={cn(
            'shrink-0 text-xs font-medium tabular-nums',
            onDark ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          {clamped}%
        </span>
      ) : null}
    </div>
  )
}
