'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { VideoThumb } from '@/components/layout/VideoThumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useGetInstructorLessons } from '@/lib/lesson/lesson.slice'
import {
  useGetInstructorTrack,
  useSaveTrackStructure,
  useUpdateTrack,
} from '@/lib/track/track.slice'
import { formatDuration, formatTotalDuration } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ModuleCard } from './components/ModuleCard'
import { useTrackDraft, type DraftLesson } from './useTrackDraft'

interface LoadedTrack {
  id: string
  slug: string
  title: string
  category: string
  published: boolean
  modules: { id: string; title: string; lessons: DraftLesson[] }[]
}

export default function TrackBuilderPage() {
  const { t } = useTranslation('guarda')
  const params = useParams<{ id: string }>()
  const trackId = params.id

  const { data, isLoading } = useGetInstructorTrack(trackId)
  const track = data as LoadedTrack | undefined

  const { data: allLessons } = useGetInstructorLessons()
  const { mutateAsync: saveStructure, isPending: isSaving } = useSaveTrackStructure(trackId)
  const { mutateAsync: updateTrack } = useUpdateTrack(trackId)

  /** Lessons of this instructor that are not in any track yet. */
  const orphans = useMemo<DraftLesson[]>(
    () =>
      (allLessons ?? [])
        .filter((lesson) => !lesson.track)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          durationSec: lesson.durationSec,
          status: lesson.status,
        })),
    [allLessons],
  )

  const draft = useTrackDraft(track?.modules, orphans)

  async function handleSave() {
    await saveStructure(draft.toPayload())
    toast.success(t('BUILDER_SAVED'))
  }

  if (isLoading || !track) {
    return (
      <PageContainer className="flex flex-col gap-6">
        <Skeleton className="h-12 w-full max-w-96" />
        <Skeleton className="h-96 w-full" />
      </PageContainer>
    )
  }

  // Lesson numbers run across the whole track, so each module needs to know
  // where the previous one left off.
  let runningPosition = 1

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {t('BUILDER_EYEBROW')}
          </p>
          <h1 className="font-display text-xl font-black leading-tight tracking-tight text-foreground">
            {track.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(`CATEGORY_${track.category}`)} · {t('MODULE_COUNT', { count: draft.modules.length })}{' '}
            · {t('LESSON_COUNT', { count: draft.lessonCount })} ·{' '}
            {formatTotalDuration(draft.totalDurationSec)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button asChild variant="outline">
            <Link href={studentRoutes.TRACK(track.slug)}>{t('BUILDER_VIEW_AS_STUDENT')}</Link>
          </Button>

          <Button onClick={handleSave} disabled={!draft.isDirty || isSaving}>
            {isSaving ? t('BUILDER_SAVING') : t('BUILDER_SAVE')}
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-8">
          {draft.modules.map((module, index) => {
            const start = runningPosition
            runningPosition += module.lessons.length

            return (
              <ModuleCard
                key={module.key}
                module={module}
                index={index}
                startPosition={start}
                onRename={(title) => draft.renameModule(module.key, title)}
                onRemove={() => draft.removeModule(module.key)}
                onReorderLesson={(lessonIndex, delta) =>
                  draft.reorderLesson(module.key, lessonIndex, delta)
                }
                onDetachLesson={(lessonId) => draft.moveLesson(lessonId, null)}
              />
            )
          })}

          <Button
            type="button"
            variant="outline"
            className="h-16 w-full border-dashed"
            onClick={() => draft.addModule(t('BUILDER_NEW_MODULE_NAME'))}
          >
            <Plus className="size-4" />
            {t('BUILDER_ADD_MODULE')}
          </Button>
        </div>

        <aside className="flex w-full flex-col gap-6 lg:w-[360px] lg:shrink-0">
          <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
            <header className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
                {t('BUILDER_UNASSIGNED')}
              </h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {draft.unassigned.length}
              </span>
            </header>

            <p className="text-xs leading-5 text-muted-foreground">
              {t('BUILDER_UNASSIGNED_HINT')}
            </p>

            {draft.unassigned.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t('BUILDER_UNASSIGNED_EMPTY')}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {draft.unassigned.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 rounded-md bg-background p-2"
                  >
                    <VideoThumb className="w-14 shrink-0 rounded-sm" />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-sm font-medium text-foreground">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(lesson.durationSec)} ·{' '}
                        {lesson.status === 'DRAFT' ? t('STATUS_DRAFT') : t('STATUS_PUBLISHED')}
                      </p>
                    </div>

                    {/* Adding needs a target module, so it is a menu rather than
                        a single button. */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-40"
                        disabled={draft.modules.length === 0}
                      >
                        <Plus className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {draft.modules.map((module) => (
                          <DropdownMenuItem
                            key={module.key}
                            onSelect={() => draft.moveLesson(lesson.id, module.key)}
                          >
                            {module.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              {t('BUILDER_SETTINGS')}
            </h2>

            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">{t('BUILDER_VISIBLE')}</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  {t('BUILDER_VISIBLE_HINT')}
                </p>
              </div>

              <Switch
                checked={track.published}
                onCheckedChange={(published) => updateTrack({ published })}
              />
            </div>
          </section>
        </aside>
      </div>
    </PageContainer>
  )
}
