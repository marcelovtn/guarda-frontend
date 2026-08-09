'use client'

import { VideoThumb } from '@/components/layout/VideoThumb'
import { cn } from '@/lib/utils'
import type { InstructorLesson } from '@/lib/lesson/types'
import { formatDuration } from '@/utils/formatLesson'
import { instructorRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

/**
 * One row of the instructor's library.
 *
 * A lesson with no module shows the "sem trilha" warning in place of its
 * position — that state is the point of the screen, not an error to hide.
 */
export function LessonRow({ lesson }: { lesson: InstructorLesson }) {
  const { t } = useTranslation('guarda')
  const isPublished = lesson.status === 'PUBLISHED'

  return (
    <Link
      href={instructorRoutes.LESSON(lesson.id)}
      className="grid grid-cols-[80px_1fr] items-center gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/40 md:grid-cols-[80px_1fr_120px_80px_100px]"
    >
      <VideoThumb className="w-20 rounded-sm" />

      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-base font-semibold text-foreground">{lesson.title}</p>

        {lesson.track ? (
          <p className="truncate text-xs text-muted-foreground">
            {lesson.track.trackTitle} · {lesson.track.moduleTitle} ·{' '}
            {t('POSITION_SHORT', {
              position: String(lesson.track.trackPosition).padStart(2, '0'),
            })}
          </p>
        ) : (
          <p className="truncate text-xs font-medium text-destructive">{t('NO_TRACK_WARNING')}</p>
        )}
      </div>

      <p className="hidden items-center gap-2 text-sm md:flex">
        <span
          className={cn(
            'size-1.5 rounded-full',
            isPublished ? 'bg-primary' : 'bg-muted-foreground/40',
          )}
        />
        <span className={isPublished ? 'text-foreground' : 'text-muted-foreground'}>
          {isPublished ? t('STATUS_PUBLISHED') : t('STATUS_DRAFT')}
        </span>
      </p>

      <p className="hidden text-right text-sm tabular-nums text-muted-foreground md:block">
        {formatDuration(lesson.durationSec)}
      </p>

      <p className="hidden text-right text-sm text-muted-foreground md:block">
        {lesson.viewerCount > 0 ? t('STUDENT_COUNT', { count: lesson.viewerCount }) : '—'}
      </p>
    </Link>
  )
}
