'use client'

import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { LessonListItem } from '@/components/layout/LessonListItem'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { useGetLessonPlayback } from '@/lib/lesson/lesson.slice'
import { useSetLessonCompleted } from '@/lib/progress/progress.slice'
import { cn } from '@/lib/utils'
import { formatRelativeDate } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Check, ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonPlayer } from './components/LessonPlayer'
import { PlayerSkeleton } from './components/PlayerSkeleton'

export default function LessonPage() {
  const { t } = useTranslation('guarda')
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const { data: lesson, isLoading } = useGetLessonPlayback(params.id)
  const { mutateAsync: setCompleted } = useSetLessonCompleted()
  const [showSidebar, setShowSidebar] = useState(true)

  if (isLoading || !lesson) return <PlayerSkeleton />

  const currentIndex = lesson.siblings.findIndex((sibling) => sibling.id === lesson.id)
  const previous = currentIndex > 0 ? lesson.siblings[currentIndex - 1] : null
  const next = currentIndex >= 0 ? (lesson.siblings[currentIndex + 1] ?? null) : null

  /** Finishing advances to the next lesson — that is the point of a track. */
  const handleEnded = async () => {
    await setCompleted({ lessonId: lesson.id, completed: true })
    if (next) router.push(studentRoutes.LESSON(next.id))
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

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label={t('PLAYER_PREVIOUS')}
                title={t('PLAYER_PREVIOUS')}
                disabled={!previous}
                onClick={() => previous && router.push(studentRoutes.LESSON(previous.id))}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                aria-label={t('PLAYER_NEXT_LESSON')}
                title={t('PLAYER_NEXT_LESSON')}
                disabled={!next}
                onClick={() => next && router.push(studentRoutes.LESSON(next.id))}
              >
                <ChevronRight className="size-4" />
              </Button>

              <Button
                variant={lesson.progress.completed ? 'secondary' : 'default'}
                onClick={() =>
                  setCompleted({ lessonId: lesson.id, completed: !lesson.progress.completed })
                }
              >
                <Check className="size-4" />
                {lesson.progress.completed ? t('PLAYER_COMPLETED') : t('PLAYER_MARK_COMPLETE')}
              </Button>

              {/* Collapsing the list gives the video the full width, which is
                  what a student wants once they are actually watching. */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex"
                aria-label={showSidebar ? t('PLAYER_HIDE_LIST') : t('PLAYER_SHOW_LIST')}
                title={showSidebar ? t('PLAYER_HIDE_LIST') : t('PLAYER_SHOW_LIST')}
                onClick={() => setShowSidebar((current) => !current)}
              >
                {showSidebar ? (
                  <PanelRightClose className="size-4" />
                ) : (
                  <PanelRightOpen className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {lesson.description ? (
            <p className="max-w-[720px] text-base leading-7 text-muted-foreground">
              {lesson.description}
            </p>
          ) : null}

          <div className="flex items-center gap-3.5 border-t border-border pt-5">
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

      {lesson.track && showSidebar ? (
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-[372px]">
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

          {/* Capped and scrollable: a track with twenty lessons made the page
              twice as tall as the video it belongs to. */}
          <div
            className={cn(
              'overflow-y-auto overscroll-contain rounded-lg border border-border bg-card',
              'max-h-[60vh] lg:max-h-[calc(100vh-220px)]',
            )}
          >
            {lesson.siblings.map((sibling) => (
              <LessonListItem
                key={sibling.id}
                dense
                lesson={sibling}
                current={sibling.id === lesson.id}
                href={studentRoutes.LESSON(sibling.id)}
                onToggleCompleted={(completed) => setCompleted({ lessonId: sibling.id, completed })}
                className="rounded-none border-b border-border last:border-b-0"
              />
            ))}
          </div>
        </aside>
      ) : null}
    </PageContainer>
  )
}
