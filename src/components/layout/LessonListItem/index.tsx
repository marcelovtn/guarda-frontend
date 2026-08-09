'use client'

import { cn } from '@/lib/utils'
import { formatDuration } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface LessonListItemData {
  id: string
  title: string
  durationSec: number
  trackPosition: number
  completed: boolean
}

interface LessonListItemProps {
  lesson: LessonListItemData
  /** Highlights the row and shows the "EM ANDAMENTO" chip. */
  current?: boolean
  /** Compact spacing, for the player sidebar. */
  dense?: boolean
  /** Turns the row into a link. Off for the instructor's track builder. */
  href?: string
  /** Replaces the trailing chevron — a drag handle or a menu, for instance. */
  trailing?: ReactNode
  className?: string
}

/**
 * One lesson in a list.
 *
 * The same row appears in three places — the track page, the player sidebar
 * and the instructor's track builder — so the differences between them are
 * props rather than three near-identical components.
 *
 * The check, the number and the trailing slot are fixed-width lanes: with a
 * gap alone, a two-line title in one row would shift the numbers of every
 * other row out of alignment.
 */
export function LessonListItem({
  lesson,
  current = false,
  dense = false,
  href,
  trailing,
  className,
}: LessonListItemProps) {
  const { t } = useTranslation('guarda')

  const content = (
    <>
      <span className="flex size-6 shrink-0 items-center justify-center">
        {lesson.completed ? (
          <span className="flex size-[22px] items-center justify-center rounded-full bg-primary">
            <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
          </span>
        ) : (
          <span
            className={cn(
              'size-[22px] rounded-full border-2',
              current ? 'border-primary' : 'border-border',
            )}
          />
        )}
      </span>

      {!dense ? (
        <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {String(lesson.trackPosition).padStart(2, '0')}
        </span>
      ) : null}

      <span
        className={cn(
          'min-w-0 flex-1 text-left',
          dense ? 'text-sm leading-5' : 'text-base leading-6',
          current ? 'font-semibold text-foreground' : 'font-medium text-foreground',
        )}
      >
        {lesson.title}
      </span>

      {current ? (
        <span className="hidden shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold tracking-caps text-primary-foreground sm:inline">
          {t('IN_PROGRESS')}
        </span>
      ) : null}

      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {formatDuration(lesson.durationSec)}
      </span>

      <span className="flex w-4 shrink-0 justify-end">
        {trailing ?? (href ? <ChevronRight className="size-4 text-muted-foreground" /> : null)}
      </span>
    </>
  )

  const classes = cn(
    'flex w-full items-center gap-3 rounded-md transition-colors',
    dense ? 'px-3 py-2.5' : 'px-4 py-4',
    current ? 'bg-accent' : 'hover:bg-secondary/50',
    className,
  )

  if (!href) {
    return <div className={classes}>{content}</div>
  }

  return (
    <Link
      href={href}
      className={cn(classes, 'outline-none focus-visible:ring-2 focus-visible:ring-ring')}
    >
      {content}
    </Link>
  )
}

/** Convenience for the student side, where the row always links to the player. */
export function lessonHref(lessonId: string) {
  return studentRoutes.LESSON(lessonId)
}
