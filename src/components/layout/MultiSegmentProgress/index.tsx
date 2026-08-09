'use client'

import { cn } from '@/lib/utils'
import type * as React from 'react'

export interface ProgressSegment {
  color: string
  percentage: number
}

interface MultiSegmentProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: ProgressSegment[]
  className?: string
}

export function MultiSegmentProgress({ segments, className, ...props }: MultiSegmentProgressProps) {
  const totalPercentage = segments.reduce((acc, segment) => acc + segment.percentage, 0)
  const scale = totalPercentage > 100 ? 100 / totalPercentage : 1

  let currentPosition = 0

  return (
    <div
      className={cn(
        'relative h-[8px] w-full overflow-hidden rounded-full bg-card-foreground/20',
        className,
      )}
      {...props}
    >
      <div className="relative h-full w-full">
        {segments.map((segment, index) => {
          const scaledPercentage = segment.percentage * scale
          const width = `${scaledPercentage}%`
          const left = `${currentPosition}%`
          currentPosition += scaledPercentage

          return (
            <div
              key={index}
              className="absolute h-full transition-[width,left] duration-500 ease-in-out"
              style={{
                width,
                left,
                backgroundColor: segment.color,
              }}
              role="progressbar"
              aria-valuenow={segment.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          )
        })}
      </div>
    </div>
  )
}
