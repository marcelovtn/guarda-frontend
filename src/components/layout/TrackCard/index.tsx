'use client'

import { ProgressBar } from '@/components/layout/ProgressBar'
import { VideoThumb } from '@/components/layout/VideoThumb'
import { formatTotalDuration } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export interface TrackCardData {
  slug: string
  title: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  lessonCount: number
  totalDurationSec: number
  posterUrl?: string | null
  progress: { percent: number } | null
}

interface TrackCardProps {
  track: TrackCardData
  /** Renders the padlock and drops the link, for the paywalled profile page. */
  locked?: boolean
}

/**
 * A track in a home row, in the tracks list, or on the public profile.
 *
 * The title reserves two lines even when it only needs one, so the metadata
 * line stays on the same baseline across a row of cards. Without it, a card
 * whose title wraps pushes its own metadata down and breaks the lane.
 */
export function TrackCard({ track, locked = false }: TrackCardProps) {
  const { t } = useTranslation('guarda')

  const body = (
    <>
      <VideoThumb
        src={track.posterUrl}
        alt={track.title}
        badge={t('LESSON_COUNT', { count: track.lessonCount })}
        locked={locked}
      />

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-foreground">
          {track.title}
        </h3>

        <p className="text-xs text-muted-foreground">
          {formatTotalDuration(track.totalDurationSec)} · {t(`LEVEL_${track.level}`)}
        </p>

        {track.progress ? (
          <ProgressBar percent={track.progress.percent} showPercent className="mt-2" />
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">{t('NOT_STARTED')}</p>
        )}
      </div>
    </>
  )

  if (locked) {
    return <div className="flex flex-col gap-3">{body}</div>
  }

  return (
    <Link
      href={studentRoutes.TRACK(track.slug)}
      className="flex flex-col gap-3 rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
    >
      {body}
    </Link>
  )
}
