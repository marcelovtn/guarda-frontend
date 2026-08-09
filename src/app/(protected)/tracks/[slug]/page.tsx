'use client'

import { LessonListItem } from '@/components/layout/LessonListItem'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSetLessonCompleted } from '@/lib/progress/progress.slice'
import { useGetTrack } from '@/lib/track/track.slice'
import { formatTotalDuration } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { ChevronRight, Play } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function TrackPage() {
  const { t } = useTranslation('guarda')
  const params = useParams<{ slug: string }>()
  const { data: track, isLoading } = useGetTrack(params.slug)
  const { mutateAsync: setCompleted } = useSetLessonCompleted()

  if (isLoading || !track) {
    return (
      <PageContainer className="flex flex-col gap-6">
        <Skeleton className="h-12 w-[520px] max-w-full" />
        <Skeleton className="h-96 w-full" />
      </PageContainer>
    )
  }

  const nextLessonId = track.progress?.nextLessonId ?? track.modules[0]?.lessons[0]?.id

  return (
    <PageContainer className="flex flex-col gap-10">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={studentRoutes.TRACKS} className="hover:text-foreground">
          {t('NAV_TRACKS')}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{track.title}</span>
      </nav>

      <header className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-caps text-primary">
            {t(`CATEGORY_${track.category}`)} · {t(`LEVEL_${track.level}`)}
          </p>

          <h1 className="max-w-[760px] font-display text-2xl font-black leading-[1.05] tracking-tight text-foreground">
            {track.title}
          </h1>

          {track.description ? (
            <p className="max-w-[740px] text-base leading-7 text-muted-foreground">
              {track.description}
            </p>
          ) : null}

          <p className="text-sm text-muted-foreground">
            {t('LESSON_COUNT', { count: track.lessonCount })} ·{' '}
            {formatTotalDuration(track.totalDurationSec)} · {track.instructor.displayName}
          </p>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 rounded-lg border border-border bg-card p-6 lg:w-[330px]">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {t('TRACK_YOUR_PROGRESS')}
          </p>

          {track.progress ? (
            <>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-xl font-black tracking-tight text-foreground">
                  {track.progress.percent}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {t('PROGRESS_OF', {
                    completed: track.progress.completedCount,
                    total: track.progress.totalCount,
                  })}
                </span>
              </p>
              <ProgressBar percent={track.progress.percent} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t('NOT_STARTED')}</p>
          )}

          {nextLessonId ? (
            <Button asChild size="lg" className="mt-1 h-12 w-full">
              <Link href={studentRoutes.LESSON(nextLessonId)}>
                <Play className="size-4 fill-current" />
                {track.progress ? t('TRACK_CONTINUE') : t('TRACK_START')}
              </Link>
            </Button>
          ) : null}
        </aside>
      </header>

      <div className="flex flex-col gap-10">
        {track.modules.map((module) => (
          <section key={module.id} className="flex flex-col gap-3">
            <header className="flex items-baseline justify-between gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-caps text-foreground">
                {t('TRACK_MODULE', { number: module.position + 1, title: module.title })}
              </h2>
              <span className="shrink-0 text-xs text-muted-foreground">
                {t('LESSON_COUNT', { count: module.lessonCount })} ·{' '}
                {formatTotalDuration(module.totalDurationSec)}
              </span>
            </header>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {module.lessons.map((lesson) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  current={lesson.id === track.progress?.nextLessonId}
                  href={studentRoutes.LESSON(lesson.id)}
                  onToggleCompleted={(completed) =>
                    setCompleted({ lessonId: lesson.id, completed })
                  }
                  className="rounded-none border-b border-border last:border-b-0"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  )
}
