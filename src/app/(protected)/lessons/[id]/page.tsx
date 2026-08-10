'use client'

import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { LessonListItem } from '@/components/layout/LessonListItem'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { useGetLessonPlayback, usePrefetchLessonPlayback } from '@/lib/lesson/lesson.slice'
import { useSetLessonCompleted } from '@/lib/progress/progress.slice'
import { cn } from '@/lib/utils'
import { formatRelativeDate } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Check, ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonPlayer } from './components/LessonPlayer'
import { PlayerSkeleton } from './components/PlayerSkeleton'

export default function LessonPage() {
  const { t } = useTranslation('guarda')
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const { data: lesson, isLoading, isPlaceholderData } = useGetLessonPlayback(params.id)
  const { mutateAsync: setCompleted } = useSetLessonCompleted()
  const prefetchLesson = usePrefetchLessonPlayback()
  const [showSidebar, setShowSidebar] = useState(true)

  /*
   * Next blocks the navigation while it fetches the route payload — measured at
   * ~160ms in development — so a plain link click did nothing visible and then
   * swapped the whole page at once. That is what read as a refresh. Routing
   * inside a transition gives an immediate pending state to dim against.
   */
  const [isNavigating, startNavigation] = useTransition()

  const goToLesson = (id: string) => startNavigation(() => router.push(studentRoutes.LESSON(id)))

  if (isLoading || !lesson) return <PlayerSkeleton />

  /*
   * True while the previous lesson is still on screen and the new one is in
   * flight. Everything used to swap at once with no signal, which is what read
   * as a page reload: the reader had no way to tell a navigation from a
   * refresh. Dimming makes it legible as a transition.
   */
  const isSwitching = isNavigating || (isPlaceholderData && lesson.id !== params.id)

  const currentIndex = lesson.siblings.findIndex((sibling) => sibling.id === lesson.id)
  const previous = currentIndex > 0 ? lesson.siblings[currentIndex - 1] : null
  const next = currentIndex >= 0 ? (lesson.siblings[currentIndex + 1] ?? null) : null

  /** Finishing advances to the next lesson — that is the point of a track. */
  const handleEnded = async () => {
    await setCompleted({ lessonId: lesson.id, completed: true })
    if (next) goToLesson(next.id)
  }

  return (
    // No gutter on a phone: the video reaches both edges, and the text below it
    // brings its own padding back. From md the page gets its margins again.
    <PageContainer className="flex flex-col gap-8 px-0 py-0 md:gap-10 md:px-8 md:py-8 lg:flex-row lg:items-start xl:px-16">
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-6 transition-opacity duration-200',
          isSwitching && 'opacity-50',
        )}
      >
        {/* The arrows sit on the video itself from lg upwards, where there is
            room beside it. Below that they stay in the action row — over a
            phone-width video they would cover the picture. */}
        <div className="relative">
          <LessonPlayer
            lessonId={lesson.id}
            videoUrl={lesson.videoUrl}
            startAtSec={lesson.progress.lastPositionSec}
            onEnded={handleEnded}
          />

          {previous ? (
            <button
              type="button"
              aria-label={t('PLAYER_PREVIOUS')}
              title={t('PLAYER_PREVIOUS')}
              onClick={() => goToLesson(previous.id)}
              className="absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : null}

          {next ? (
            <button
              type="button"
              aria-label={t('PLAYER_NEXT_LESSON')}
              title={t('PLAYER_NEXT_LESSON')}
              onClick={() => goToLesson(next.id)}
              className="absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-5 px-5 md:px-0">
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
                className="lg:hidden"
                aria-label={t('PLAYER_PREVIOUS')}
                title={t('PLAYER_PREVIOUS')}
                disabled={!previous}
                onClick={() => previous && goToLesson(previous.id)}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label={t('PLAYER_NEXT_LESSON')}
                title={t('PLAYER_NEXT_LESSON')}
                disabled={!next}
                onClick={() => next && goToLesson(next.id)}
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

              {/* Only appears once the list is gone — with the list open, the
                  control lives in its header, next to what it closes. Hiding
                  it there would leave no way back. */}
              {lesson.track && !showSidebar ? (
                <Button
                  variant="outline"
                  className="hidden lg:inline-flex"
                  onClick={() => setShowSidebar(true)}
                >
                  <PanelRightOpen className="size-4" />
                  {t('PLAYER_SHOW_LIST')}
                </Button>
              ) : null}
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
        <aside className="flex w-full shrink-0 flex-col gap-3 px-5 md:px-0 lg:w-[372px]">
          <header className="flex items-center justify-between gap-3">
            <Link
              href={studentRoutes.TRACK(lesson.track.trackSlug)}
              className="text-xs font-semibold uppercase tracking-caps text-foreground hover:underline"
            >
              {t('PLAYER_IN_THIS_TRACK')}
            </Link>
            <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
              {lesson.siblings.findIndex((s) => s.id === params.id) + 1 ||
                lesson.track.trackPosition}{' '}
              / {lesson.siblings.length}
            </span>

            {/* Sits on the list it closes, not across the page next to the
                completion button, where it read as one more lesson action. */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden size-7 shrink-0 text-muted-foreground lg:inline-flex"
              aria-label={t('PLAYER_HIDE_LIST')}
              title={t('PLAYER_HIDE_LIST')}
              onClick={() => setShowSidebar(false)}
            >
              <PanelRightClose className="size-4" />
            </Button>
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
                // Follows the URL, not the fetched lesson, so the highlight moves
                // the instant the student clicks instead of 260ms later.
                current={sibling.id === params.id}
                href={studentRoutes.LESSON(sibling.id)}
                onNavigate={() => goToLesson(sibling.id)}
                onPrefetch={() => prefetchLesson(sibling.id)}
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
