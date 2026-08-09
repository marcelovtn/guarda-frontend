'use client'

import { FormInput, FormSelect, FormTextarea } from '@/components/layout/Form'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { useCreateLesson, useCreateLessonUploadTarget } from '@/lib/lesson/lesson.slice'
import { useGetInstructorTracks } from '@/lib/track/track.slice'
import { instructorRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { VideoUploadField, type VideoUploadState } from './components/VideoUploadField'
import { newLessonSchema, type NewLessonValues } from './schema'
import { useTrackModules } from './useTrackModules'

const NO_TRACK = 'none'

export default function NewLessonPage() {
  const { t } = useTranslation('guarda')
  const router = useRouter()

  const { data: tracks } = useGetInstructorTracks()
  const { mutateAsync: createUploadTarget } = useCreateLessonUploadTarget()
  const { mutateAsync: createLesson } = useCreateLesson()

  const [video, setVideo] = useState<VideoUploadState | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<NewLessonValues>({
    resolver: zodResolver(newLessonSchema),
    mode: 'onChange',
    defaultValues: { title: '', description: '', trackId: NO_TRACK, moduleId: '' },
  })

  const trackId = watch('trackId')
  const { modules, isLoading: isLoadingModules } = useTrackModules(
    trackId === NO_TRACK ? null : trackId,
  )

  const isUploaded = Boolean(video?.key)
  const canPublish = isValid && isUploaded && !isSaving

  const trackOptions = useMemo(
    () => [
      { value: NO_TRACK, label: t('NEW_LESSON_NO_TRACK') },
      ...(tracks ?? []).map((track) => ({ value: track.id, label: track.title })),
    ],
    [tracks, t],
  )

  /**
   * Starts the upload immediately on pick and leaves the form usable.
   *
   * Progress is reported straight to component state rather than through React
   * Query — it changes many times a second and would thrash the cache.
   */
  async function handleSelect(file: File) {
    setVideo({
      fileName: file.name,
      sizeBytes: file.size,
      uploadProgress: 0,
      key: null,
    })

    try {
      const target = await createUploadTarget(file)

      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('PUT', target.uploadUrl)
        request.setRequestHeader('Content-Type', file.type)
        // No timeout: a gigabyte on a home connection can take hours, and
        // aborting halfway would make the instructor start over.
        request.timeout = 0

        request.upload.onprogress = (event) => {
          if (!event.lengthComputable) return
          setVideo((current) =>
            current ? { ...current, uploadProgress: event.loaded / event.total } : current,
          )
        }

        request.onload = () =>
          request.status >= 200 && request.status < 300
            ? resolve()
            : reject(new Error(`Storage respondeu ${request.status}`))
        request.onerror = () => reject(new Error(t('NEW_LESSON_UPLOAD_FAILED')))
        request.send(file)
      })

      setVideo((current) =>
        current ? { ...current, uploadProgress: 1, key: target.key } : current,
      )
    } catch (error: any) {
      setVideo((current) =>
        current ? { ...current, error: error?.message ?? t('NEW_LESSON_UPLOAD_FAILED') } : current,
      )
    }
  }

  async function save(values: NewLessonValues, status: 'DRAFT' | 'PUBLISHED') {
    setIsSaving(true)
    try {
      const lesson = await createLesson({
        title: values.title,
        description: values.description || null,
        videoKey: video?.key ?? null,
        moduleId: values.moduleId || null,
        status,
      })

      toast.success(status === 'PUBLISHED' ? t('NEW_LESSON_PUBLISHED') : t('NEW_LESSON_SAVED'))
      router.push(instructorRoutes.LESSON(lesson.id))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageContainer className="flex max-w-[1000px] flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {t('NEW_LESSON_EYEBROW')}
        </p>
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('NEW_LESSON_TITLE')}
        </h1>
      </header>

      <VideoUploadField video={video} onSelect={handleSelect} disabled={isSaving} />

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
          {/*
            Publishing needs a finished upload — the backend refuses a lesson
            with no video, and letting the button look available until then just
            moves the error later.
          */}
          {!isUploaded ? (
            <p className="flex-1 text-sm text-muted-foreground">
              {t('NEW_LESSON_PUBLISH_BLOCKED')}
            </p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            disabled={!isValid || isSaving}
            onClick={handleSubmit((values) => save(values, 'DRAFT'))}
          >
            {t('NEW_LESSON_SAVE_DRAFT')}
          </Button>

          <Button
            type="button"
            disabled={!canPublish}
            onClick={handleSubmit((values) => save(values, 'PUBLISHED'))}
          >
            {t('NEW_LESSON_PUBLISH')}
          </Button>
        </footer>
      </form>
    </PageContainer>
  )
}
