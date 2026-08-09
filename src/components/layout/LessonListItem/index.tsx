'use client'

import { cn } from '@/lib/utils'
import { formatDuration } from '@/utils/formatLesson'
import { Check } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface LessonListItemData {
  id: string
  title: string
  durationSec: number
  trackPosition: number
  completed: boolean
  /** Seconds watched. Anything above zero means the lesson was started. */
  lastPositionSec?: number
}

/**
 * Three states, not two: a lesson can be untouched, started, or finished.
 * Without the middle one a student who stopped halfway looks like they never
 * opened it.
 */
type LessonStatus = 'not-started' | 'in-progress' | 'completed'

function statusOf(lesson: LessonListItemData): LessonStatus {
  if (lesson.completed) return 'completed'
  return (lesson.lastPositionSec ?? 0) > 0 ? 'in-progress' : 'not-started'
}

interface LessonListItemProps {
  lesson: LessonListItemData
  /** Highlights the row as the one currently open in the player. */
  current?: boolean
  /** Compact spacing, for the player sidebar. */
  dense?: boolean
  href?: string
  /** Called when the status circle is pressed. Omit to render it read-only. */
  onToggleCompleted?: (completed: boolean) => void
  /** Replaces the trailing slot — a drag handle or a menu, for instance. */
  trailing?: ReactNode
  className?: string
}

/**
 * One lesson in a list.
 *
 * The same row appears on the track page, in the player sidebar and in the
 * instructor's track builder, so the differences are props rather than three
 * near-identical components.
 *
 * The status circle is a sibling of the link, not a child: a button inside an
 * anchor is invalid HTML, and nesting them would make marking a lesson complete
 * also navigate away from the page you are on.
 */
export function LessonListItem({
  lesson,
  current = false,
  dense = false,
  href,
  onToggleCompleted,
  trailing,
  className,
}: LessonListItemProps) {
  const { t } = useTranslation('guarda')
  const status = statusOf(lesson)

  const circle = (
    <span
      className={cn(
        'flex size-[22px] items-center justify-center rounded-full border-2 transition-colors',
        status === 'completed' && 'border-primary bg-primary',
        status === 'in-progress' && 'border-primary',
        status === 'not-started' && 'border-border',
        onToggleCompleted && 'group-hover/status:border-primary',
      )}
    >
      {status === 'completed' ? (
        <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
      ) : status === 'in-progress' ? (
        // A filled centre rather than a partial ring: it reads at 22px, where
        // an arc does not.
        <span className="size-2 rounded-full bg-primary" />
      ) : null}
    </span>
  )

  const statusLabel =
    status === 'completed'
      ? t('LESSON_STATUS_COMPLETED')
      : status === 'in-progress'
        ? t('LESSON_STATUS_IN_PROGRESS')
        : t('LESSON_STATUS_NOT_STARTED')

  const body = (
    <>
      {!dense ? (
        <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {String(lesson.trackPosition).padStart(2, '0')}
        </span>
      ) : null}

      <span
        className={cn(
          'min-w-0 flex-1 text-left',
          dense ? 'line-clamp-2 text-sm leading-5' : 'text-base leading-6',
          current ? 'font-semibold text-foreground' : 'font-medium text-foreground',
        )}
      >
        {lesson.title}
      </span>

      {current && !dense ? (
        <span className="hidden shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold tracking-caps text-primary-foreground sm:inline">
          {t('IN_PROGRESS')}
        </span>
      ) : null}

      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {formatDuration(lesson.durationSec)}
      </span>
    </>
  )

  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 rounded-md transition-colors',
        dense ? 'px-3 py-2.5' : 'px-4 py-4',
        current ? 'bg-accent' : 'hover:bg-secondary/50',
        className,
      )}
    >
      {onToggleCompleted ? (
        <button
          type="button"
          aria-label={statusLabel}
          title={statusLabel}
          onClick={() => onToggleCompleted(!lesson.completed)}
          className="group/status flex shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {circle}
        </button>
      ) : (
        <span className="flex shrink-0 items-center justify-center" title={statusLabel}>
          {circle}
        </span>
      )}

      {href ? (
        <Link
          href={href}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {body}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{body}</div>
      )}

      {trailing ? <span className="flex shrink-0 items-center">{trailing}</span> : null}
    </div>
  )
}
