'use client'

import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { LessonListItem } from '@/components/layout/LessonListItem'
import { PageContainer } from '@/components/layout/PageContainer'
import { VideoThumb } from '@/components/layout/VideoThumb'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLessonPlayback } from '@/lib/lesson/lesson.slice'
import { useSetLessonCompleted } from '@/lib/progress/progress.slice'
import { formatDuration, formatRelativeDate } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { LessonPlayer } from './components/LessonPlayer'

export default function LessonPage() {
  const { t } = useTranslation('guarda')
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const { data: lesson, isLoading } = useGetLessonPlayback(params.id)
  const { mutateAsync: setCompleted } = useSetLessonCompleted()

  if (isLoading || !lesson) {
    return (
      <PageContainer className="flex flex-col gap-6 lg:flex-row">
        <Skeleton className="aspect-video w-full lg:w-[900px]" />
        <Skeleton className="h-96 w-full lg:w-[372px]" />
      </PageContainer>
    )
  }

  // A const arrow rather than a declaration: a hoisted function is not covered
  // by the narrowing from the guard above.
  /** Finishing advances to the next lesson — that is the point of a track. */
  const handleEnded = async () => {
    await setCompleted({ lessonId: lesson.id, completed: true })
    if (lesson.nextLesson) router.push(studentRoutes.LESSON(lesson.nextLesson.id))
  }

  return (
    <PageContainer className="flex flex-col gap-10 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <LessonPlayer
          lessonId={lesson.id}
          videoUrl={lesson.videoUrl}
          startAtSec={lesson.progress.lastPositionSec}
          onEnded={handleEnded}
        />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              {lesson.track ? (
                <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
                  {t('PLAYER_POSITION', {
                    module: lesson.track.moduleNumber,
                    position: String(lesson.track.trackPosition).padStart(2, '0'),
                    total: lesson.siblings.length,
                  })}
                </p>
              ) : null}

              <h1 className="max-w-[640px] font-display text-xl font-black leading-tight tracking-tight text-foreground">
                {lesson.title}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Button
                variant={lesson.progress.completed ? 'secondary' : 'default'}
                onClick={() =>
                  setCompleted({ lessonId: lesson.id, completed: !lesson.progress.completed })
                }
              >
                <Check className="size-4" />
                {lesson.progress.completed ? t('PLAYER_COMPLETED') : t('PLAYER_MARK_COMPLETE')}
              </Button>
            </div>
          </div>

          {lesson.description ? (
            <p className="max-w-[720px] text-base leading-7 text-muted-foreground">
              {lesson.description}
            </p>
          ) : null}

          {/* The instructor row, in the shape a viewer already knows from
              video platforms: who made this, and how much else they have. */}
          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <InstructorAvatar name={lesson.instructor.displayName} size="md" />
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-base font-semibold text-foreground">
                  {lesson.instructor.displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {t('LESSON_COUNT', { count: lesson.instructor.lessonCount })} ·{' '}
                  {t('TRACK_COUNT', { count: lesson.instructor.trackCount })}
                  {lesson.instructor.lastPublishedAt
                    ? ` · ${t('PLAYER_LAST_LESSON', {
                        when: formatRelativeDate(lesson.instructor.lastPublishedAt),
                      })}`
                    : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[372px]">
        {lesson.track ? (
          <section className="flex flex-col gap-3">
            <header className="flex items-baseline justify-between gap-4">
              <Link
                href={studentRoutes.TRACK(lesson.track.trackSlug)}
                className="text-xs font-semibold uppercase tracking-caps text-foreground hover:underline"
              >
                {t('PLAYER_IN_THIS_TRACK')}
              </Link>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {lesson.track.trackPosition} / {lesson.siblings.length}
              </span>
            </header>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {lesson.siblings.map((sibling) => (
                <LessonListItem
                  key={sibling.id}
                  dense
                  lesson={sibling}
                  current={sibling.id === lesson.id}
                  href={studentRoutes.LESSON(sibling.id)}
                  className="rounded-none border-b border-border last:border-b-0"
                />
              ))}
            </div>
          </section>
        ) : null}

        {lesson.nextLesson ? (
          <Link
            href={studentRoutes.LESSON(lesson.nextLesson.id)}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/40"
          >
            <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              {t('PLAYER_NEXT')}
            </p>

            <div className="flex items-center gap-3">
              <VideoThumb className="w-24 shrink-0 rounded-sm" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {lesson.nextLesson.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(lesson.nextLesson.durationSec)}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        ) : null}
      </aside>
    </PageContainer>
  )
}
