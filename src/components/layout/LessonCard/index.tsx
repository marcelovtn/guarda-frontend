'use client'

import { VideoThumb } from '@/components/layout/VideoThumb'
import { formatDuration, formatRelativeDate } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export interface LessonCardData {
  id: string
  title: string
  durationSec: number
  publishedAt: string | Date | null
  posterUrl?: string | null
  track: { trackTitle: string; category: string } | null
}

interface LessonCardProps {
  lesson: LessonCardData
  /**
   * Shows the track name as a small caps eyebrow above the title, as the home
   * "Novo do professor" row does. The videos grid puts it below instead.
   */
  eyebrow?: boolean
}

/** A lesson in the home "Novo do professor" row or in the videos grid. */
export function LessonCard({ lesson, eyebrow = false }: LessonCardProps) {
  const { t } = useTranslation('guarda')

  const trackLabel = lesson.track?.trackTitle ?? t('CATEGORY_NONE')

  return (
    <Link
      href={studentRoutes.LESSON(lesson.id)}
      className="flex flex-col gap-3 rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <VideoThumb
        src={lesson.posterUrl}
        alt={lesson.title}
        badge={formatDuration(lesson.durationSec)}
      />

      <div className="flex flex-col gap-1">
        {eyebrow ? (
          <p className="truncate text-[11px] font-semibold uppercase tracking-caps text-muted-foreground">
            {trackLabel}
          </p>
        ) : null}

        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-foreground">
          {lesson.title}
        </h3>

        {!eyebrow ? (
          <p className="truncate text-xs text-muted-foreground">
            {trackLabel} · {formatRelativeDate(lesson.publishedAt)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
