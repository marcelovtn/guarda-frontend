'use client'

import { FormInput, FormSelect, FormTextarea } from '@/components/layout/Form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteLesson, useUpdateLesson } from '@/lib/lesson/lesson.slice'
import type { InstructorLessonDetail } from '@/lib/lesson/types'
import { useGetInstructorTracks } from '@/lib/track/track.slice'
import { formatDuration } from '@/utils/formatLesson'
import { instructorRoutes, studentRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { VideoUploadField } from '../../components/VideoUploadField'
import { NO_TRACK, lessonFormSchema, type LessonFormValues } from '../../schema'
import { useTrackModules } from '../../useTrackModules'
import { useVideoUpload } from '../../useVideoUpload'

/**
 * The form itself, mounted only once the lesson is in hand.
 *
 * Taking the lesson as a prop rather than fetching it here is what lets
 * `defaultValues` be the real values. Filling the form afterwards left the
 * track and module selects empty — and an empty select that saves is not a
 * cosmetic bug: it detaches the lesson from its module.
 */
export function LessonEditor({ lesson }: { lesson: InstructorLessonDetail }) {
  const { t } = useTranslation('guarda')
  const router = useRouter()

  const { data: tracks } = useGetInstructorTracks()
  const { mutateAsync: updateLesson } = useUpdateLesson(lesson.id)
  const { mutateAsync: deleteLesson } = useDeleteLesson()
  const { video, upload, isUploaded } = useVideoUpload()

  const [isSaving, setIsSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: lesson.title,
      description: lesson.description ?? '',
      trackId: lesson.track?.trackId ?? NO_TRACK,
      moduleId: lesson.track?.moduleId ?? '',
    },
  })

  const trackId = watch('trackId')
  const { modules, isLoading: isLoadingModules } = useTrackModules(
    trackId === NO_TRACK ? null : trackId,
  )

  const isPublished = lesson.status === 'PUBLISHED'
  /** Either the freshly uploaded video or the one already on the lesson. */
  const hasVideo = isUploaded || lesson.hasVideo

  const trackOptions = useMemo(
    () => [
      { value: NO_TRACK, label: t('NEW_LESSON_NO_TRACK') },
      ...(tracks ?? []).map((track) => ({ value: track.id, label: track.title })),
    ],
    [tracks, t],
  )

  const moduleOptions = useMemo(() => {
    const options = modules.map((module) => ({ value: module.id, label: module.title }))

    // The lesson's own module, in case the track detail has not landed yet:
    // without it the select would show a placeholder over a real value.
    if (lesson.track && !options.some((option) => option.value === lesson.track!.moduleId)) {
      options.unshift({ value: lesson.track.moduleId, label: lesson.track.moduleTitle })
    }

    return options
  }, [modules, lesson.track])

  async function save(values: LessonFormValues, status: 'DRAFT' | 'PUBLISHED') {
    setIsSaving(true)
    try {
      await updateLesson({
        title: values.title,
        description: values.description || null,
        moduleId: values.moduleId || null,
        status,
        // Only sent when a new file went up: omitting it leaves the stored
        // video alone, where null would detach it.
        ...(video?.key ? { videoKey: video.key, durationSec: video.durationSec } : {}),
      })

      toast.success(status === 'PUBLISHED' ? t('NEW_LESSON_PUBLISHED') : t('EDIT_LESSON_SAVED'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    await deleteLesson(lesson.id)
    toast.success(t('EDIT_LESSON_DELETED'))
    router.push(instructorRoutes.LESSONS)
  }

  return (
    <>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {t('EDIT_LESSON_EYEBROW')}
          </p>
          <h1 className="font-display text-xl font-black tracking-tight text-foreground">
            {lesson.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPublished ? t('STATUS_PUBLISHED') : t('STATUS_DRAFT')}
            {lesson.durationSec > 0 ? ` · ${formatDuration(lesson.durationSec)}` : ''}
            {lesson.viewerCount > 0
              ? ` · ${t('STUDENT_COUNT', { count: lesson.viewerCount })}`
              : ''}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isPublished ? (
            <Button asChild variant="outline">
              <Link href={studentRoutes.LESSON(lesson.id)}>
                <ExternalLink className="size-4" />
                {t('EDIT_LESSON_VIEW_AS_STUDENT')}
              </Link>
            </Button>
          ) : null}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('EDIT_LESSON_DELETE')}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('EDIT_LESSON_DELETE_TITLE')}</AlertDialogTitle>
                <AlertDialogDescription>{t('EDIT_LESSON_DELETE_BODY')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('EDIT_LESSON_DELETE_CANCEL')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {t('EDIT_LESSON_DELETE')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <VideoUploadField
        video={video}
        onSelect={upload}
        disabled={isSaving}
        currentVideoUrl={lesson.videoUrl}
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
            options={moduleOptions}
          />
        </div>

        <footer className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
          {!hasVideo ? (
            <p className="flex-1 text-sm text-muted-foreground">
              {t('NEW_LESSON_PUBLISH_BLOCKED')}
            </p>
          ) : null}

          {isPublished ? (
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handleSubmit((values) => save(values, 'DRAFT'))}
            >
              {t('EDIT_LESSON_UNPUBLISH')}
            </Button>
          ) : null}

          <Button
            type="button"
            disabled={!isValid || isSaving || (!isDirty && !video?.key)}
            onClick={handleSubmit((values) => save(values, isPublished ? 'PUBLISHED' : 'DRAFT'))}
          >
            {t('EDIT_LESSON_SAVE')}
          </Button>

          {!isPublished ? (
            <Button
              type="button"
              disabled={!isValid || !hasVideo || isSaving}
              onClick={handleSubmit((values) => save(values, 'PUBLISHED'))}
            >
              {t('NEW_LESSON_PUBLISH')}
            </Button>
          ) : null}
        </footer>
      </form>
    </>
  )
}
