'use client'

import { FormInput, FormSelect, FormTextarea, SubmitButton } from '@/components/layout/Form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreateTrack } from '@/lib/track/track.slice'
import type { TrackCategory, TrackLevel } from '@/lib/instructor/types'
import { instructorRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { newTrackSchema, type NewTrackValues } from '../schema'

const CATEGORIES: TrackCategory[] = [
  'GUARD',
  'PASSING',
  'CONTROL',
  'SUBMISSIONS',
  'ESCAPES',
  'TAKEDOWNS',
]

const LEVELS: TrackLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

/**
 * Creates a track and goes straight to its builder.
 *
 * A track is useless until it has modules and lessons, so dropping the
 * instructor back on the list after creating one would just make them click
 * again.
 */
export function NewTrackDialog({ trigger }: { trigger: ReactNode }) {
  const { t } = useTranslation('guarda')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { mutateAsync: createTrack } = useCreateTrack()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewTrackValues>({
    resolver: zodResolver(newTrackSchema),
    defaultValues: { title: '', description: '', category: 'GUARD', level: 'BEGINNER' },
  })

  async function onSubmit(values: NewTrackValues) {
    const track = await createTrack(values)
    reset()
    setOpen(false)
    router.push(instructorRoutes.TRACK(track.id))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            {t('NEW_TRACK_TITLE')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormInput name="title" control={control} label={t('NEW_TRACK_NAME')} />

          <FormTextarea name="description" control={control} label={t('NEW_TRACK_DESCRIPTION')} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              name="category"
              control={control}
              label={t('NEW_TRACK_CATEGORY')}
              options={CATEGORIES.map((value) => ({
                value,
                label: t(`CATEGORY_${value}`),
              }))}
            />

            <FormSelect
              name="level"
              control={control}
              label={t('NEW_TRACK_LEVEL')}
              options={LEVELS.map((value) => ({ value, label: t(`LEVEL_${value}`) }))}
            />
          </div>

          <SubmitButton isLoading={isSubmitting} label={t('NEW_TRACK_SUBMIT')} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
