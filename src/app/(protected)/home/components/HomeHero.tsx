'use client'

import { ProgressBar } from '@/components/layout/ProgressBar'
import { VideoThumb } from '@/components/layout/VideoThumb'
import { Button } from '@/components/ui/button'
import type { ContinueWatching } from '@/lib/progress/progress.slice'
import type { TrackSummary } from '@/lib/track/types'
import { formatDuration, formatTotalDuration } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Play } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface HomeHeroProps {
  /** Present when the student has an unfinished lesson. */
  continueWatching: ContinueWatching | null
  /** Offered instead, on a first visit. */
  recommended: TrackSummary | null
}

/**
 * The two states of the home page.
 *
 * A returning student is shown where they stopped; a new one is shown where to
 * start. They are the same layout with different copy, because the shape of the
 * decision is the same: one thing to press.
 */
export function HomeHero({ continueWatching, recommended }: HomeHeroProps) {
  const { t } = useTranslation('guarda')

  if (continueWatching) {
    const watched = continueWatching.durationSec - continueWatching.remainingSec
    const percent = (watched / continueWatching.durationSec) * 100

    return (
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
        <Link
          href={studentRoutes.LESSON(continueWatching.lessonId)}
          className="w-full shrink-0 lg:w-[720px]"
        >
          <VideoThumb
            showPlay
            eyebrow={
              continueWatching.track
                ? t('HOME_LESSON_NUMBER', {
                    number: String(continueWatching.track.trackPosition).padStart(2, '0'),
                  })
                : undefined
            }
            footer={
              <div className="flex flex-col gap-2">
                <ProgressBar percent={percent} onDark />
                <p className="text-xs text-white/70">
                  {t('HOME_REMAINING', {
                    remaining: formatDuration(continueWatching.remainingSec),
                    total: formatDuration(continueWatching.durationSec),
                  })}
                </p>
              </div>
            }
          />
        </Link>

        <div className="flex flex-1 flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {t('HOME_CONTINUE')}
          </p>

          <h1 className="font-display text-xl font-black leading-tight tracking-tight text-foreground">
            {continueWatching.title}
          </h1>

          {continueWatching.track ? (
            <Link
              href={studentRoutes.TRACK(continueWatching.track.trackSlug)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {continueWatching.track.trackTitle}
            </Link>
          ) : null}

          {continueWatching.description ? (
            <p className="max-w-[540px] text-base leading-7 text-muted-foreground">
              {continueWatching.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <Button asChild size="lg" className="h-14 px-6 text-base">
              <Link href={studentRoutes.LESSON(continueWatching.lessonId)}>
                <Play className="size-4 fill-current" />
                {t('HOME_CONTINUE_CTA')}
              </Link>
            </Button>

            {continueWatching.track ? (
              <Link
                href={studentRoutes.TRACK(continueWatching.track.trackSlug)}
                className="text-sm font-medium text-foreground hover:underline"
              >
                {t('HOME_SEE_TRACK')}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  if (!recommended) return null

  /*
   * "Comece por aqui" opens the first lesson, not the track page. The student
   * already chose the track by pressing this — sending them to a list of what
   * they just picked is one page too many. "Ver a trilha inteira" is there for
   * anyone who does want the overview.
   */
  const startHref = recommended.firstLessonId
    ? studentRoutes.LESSON(recommended.firstLessonId)
    : studentRoutes.TRACK(recommended.slug)

  return (
    <section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
      <Link href={startHref} className="w-full shrink-0 lg:w-[720px]">
        <VideoThumb showPlay eyebrow={t('HOME_LESSON_NUMBER', { number: '01' })} />
      </Link>

      <div className="flex flex-1 flex-col gap-5">
        <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {t('HOME_START_HERE')}
        </p>

        <h1 className="font-display text-xl font-black leading-tight tracking-tight text-foreground">
          {recommended.title}
        </h1>

        <p className="text-sm font-medium text-primary">
          {t(`CATEGORY_${recommended.category}`)} ·{' '}
          {t('LESSON_COUNT', { count: recommended.lessonCount })} ·{' '}
          {formatTotalDuration(recommended.totalDurationSec)}
        </p>

        {recommended.description ? (
          <p className="max-w-[540px] text-base leading-7 text-muted-foreground">
            {recommended.description}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-5 pt-1">
          <Button asChild size="lg" className="h-14 px-6 text-base">
            <Link href={startHref}>
              <Play className="size-4 fill-current" />
              {t('HOME_START_CTA')}
            </Link>
          </Button>

          <Link
            href={studentRoutes.TRACK(recommended.slug)}
            className="text-sm font-medium text-foreground hover:underline"
          >
            {t('HOME_SEE_TRACK')}
          </Link>
        </div>
      </div>
    </section>
  )
}
