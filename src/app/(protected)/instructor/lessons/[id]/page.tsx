'use client'

import { FormInput, FormSelect, FormTextarea } from '@/components/layout/Form'
import { PageContainer } from '@/components/layout/PageContainer'
import { VideoUploadField } from '@/components/layout/VideoUploadField'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetInstructorLesson, useUpdateLesson } from '@/lib/lesson/lesson.slice'
import { useVideoUpload } from '@/lib/lesson/useVideoUpload'
import { useGetInstructorTracks } from '@/lib/track/track.slice'
import { useTrackModules } from '@/lib/track/useTrackModules'
import { cn } from '@/lib/utils'
import { formatDuration } from '@/utils/formatLesson'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { editLessonSchema, type EditLessonValues } from './schema'

const NO_TRACK = 'none'

/**
 * One lesson, editable.
 *
 * This screen is where the library rows and the "nova aula" redirect land, and
 * it is the only place a video can be swapped after the fact — the create
 * screen is a one-shot form and cannot reach a lesson that already exists.
 */
export default function InstructorLessonPage() {
  const { t } = useTranslation('guarda')
  const { id } = useParams<{ id: string }>()

  const { data: lesson, isLoading, isError } = useGetInstructorLesson(id)
  const { data: tracks } = useGetInstructorTracks()
  const { mutateAsync: updateLesson } = useUpdateLesson(id)
  const { video, select } = useVideoUpload()

  const [isSaving, setIsSaving] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<EditLessonValues>({
    resolver: zodResolver(editLessonSchema),
    mode: 'onChange',
    defaultValues: { title: '', description: '', trackId: NO_TRACK, moduleId: '' },
  })

  const trackId = watch('trackId')
  const { modules, isLoading: isLoadingModules } = useTrackModules(
    trackId === NO_TRACK ? null : trackId,
  )

  const isPublished = lesson?.status === 'PUBLISHED'
  // Um upload em andamento tem key null: só depois que os bytes chegam é que a
  // aula pode apontar para o arquivo novo.
  const isUploading = Boolean(video) && !video?.key && !video?.error
  const hasVideo = Boolean(video?.key ?? lesson?.videoKey)
  const canPublish = isValid && hasVideo && !isUploading && !isSaving

  const trackOptions = useMemo(
    () => [
      { value: NO_TRACK, label: t('NEW_LESSON_NO_TRACK') },
      ...(tracks ?? []).map((track) => ({ value: track.id, label: track.title })),
    ],
    [tracks, t],
  )

  async function save(values: EditLessonValues, status?: 'DRAFT' | 'PUBLISHED') {
    setIsSaving(true)
    try {
      await updateLesson({
        title: values.title,
        description: values.description || null,
        moduleId: values.moduleId || null,
        ...(status ? { status } : {}),
        // Só manda vídeo quando um novo terminou de subir. Mandar undefined
        // preserva o que já estava lá; mandar null apagaria a aula do player.
        ...(video?.key ? { videoKey: video.key, durationSec: video.durationSec } : {}),
      })

      toast.success(
        status === 'PUBLISHED'
          ? t('NEW_LESSON_PUBLISHED')
          : status === 'DRAFT'
            ? t('LESSON_EDIT_UNPUBLISHED')
            : t('LESSON_EDIT_SAVED'),
      )
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (!lesson) return

    reset({
      title: lesson.title,
      description: lesson.description ?? '',
      trackId: lesson.trackId ?? NO_TRACK,
      moduleId: lesson.moduleId ?? '',
    })
  }, [lesson, reset])

  if (isError) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">{t('LESSON_EDIT_NOT_FOUND')}</p>
      </PageContainer>
    )
  }

  if (isLoading || !lesson) {
    return (
      <PageContainer className="flex max-w-[1000px] flex-col gap-8">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex max-w-[1000px] flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {t('LESSON_EDIT_EYEBROW')}
        </p>
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {lesson.title}
        </h1>

        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                'size-1.5 rounded-full',
                isPublished ? 'bg-primary' : 'bg-muted-foreground/40',
              )}
            />
            <span className={isPublished ? 'text-foreground' : 'text-muted-foreground'}>
              {isPublished ? t('STATUS_PUBLISHED') : t('STATUS_DRAFT')}
            </span>
          </span>

          {lesson.durationSec > 0 ? (
            <span className="tabular-nums text-muted-foreground">
              {formatDuration(lesson.durationSec)}
            </span>
          ) : null}
        </div>
      </header>

      <VideoUploadField
        video={video}
        onSelect={select}
        hasStoredVideo={Boolean(lesson.videoKey)}
        disabled={isSaving}
      />

      <form className="flex flex-col gap-6">
        <FormInput name="title" control={control} label={t('NEW_LESSON_NAME')} />

        <FormTextarea name="description" control={control} label={t('NEW_LESSON_DESCRIPTION')} />

        <div className="grid gap-5 md:grid-cols-2">
          <FormSelect
            name="trackId"
            control={control}
            label={t('NEW_LESSON_TRACK')}
            options={trackOptions}
          />

          <FormSelect
            name="moduleId"
            control={control}
            label={t('NEW_LESSON_MODULE')}
            disabled={trackId === NO_TRACK || isLoadingModules}
            options={modules.map((module) => ({ value: module.id, label: module.title }))}
          />
        </div>

        <footer className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
          {!hasVideo || isUploading ? (
            <p className="flex-1 text-sm text-muted-foreground">
              {t('NEW_LESSON_PUBLISH_BLOCKED')}
            </p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            disabled={!isValid || isSaving}
            onClick={handleSubmit((values) => save(values))}
          >
            {t('LESSON_EDIT_SAVE')}
          </Button>

          {isPublished ? (
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handleSubmit((values) => save(values, 'DRAFT'))}
            >
              {t('LESSON_EDIT_UNPUBLISH')}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canPublish}
              onClick={handleSubmit((values) => save(values, 'PUBLISHED'))}
            >
              {t('NEW_LESSON_PUBLISH')}
            </Button>
          )}
        </footer>
      </form>
    </PageContainer>
  )
}
