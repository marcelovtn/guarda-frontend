'use client'

import { FormInput, FormTextarea, SubmitButton } from '@/components/layout/Form'
import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { PageContainer } from '@/components/layout/PageContainer'
import { PhotoUploadField } from '@/components/layout/PhotoUploadField'
import { StatStrip } from '@/components/layout/StatStrip'
import { Button } from '@/components/ui/button'
import {
  useGetInstructorProfile,
  useUpdateInstructorProfile,
} from '@/lib/instructor/instructor.slice'
import { formatPriceFromCents, formatRelativeDate } from '@/utils/formatLesson'
import { publicRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { profileSchema, type ProfileValues } from './schema'

const MAX_BIO = 400

export default function InstructorProfilePage() {
  const { t } = useTranslation('guarda')
  const { data: profile } = useGetInstructorProfile()
  const { mutateAsync: updateProfile } = useUpdateInstructorProfile()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '', bio: '' },
  })

  const bio = watch('bio') ?? ''

  async function onSubmit(values: ProfileValues) {
    const updated = await updateProfile(values)
    reset({ displayName: updated.displayName, bio: updated.bio ?? '' })
  }

  async function handlePhoto(key: string, url: string) {
    setPhotoUrl(url)
    await updateProfile({ photoKey: key })
  }

  useEffect(() => {
    if (profile) {
      reset({ displayName: profile.displayName, bio: profile.bio ?? '' })
    }
  }, [profile, reset])

  if (!profile) return null

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {t('PROFILE_EYEBROW')}
        </p>
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('PROFILE_TITLE')}
        </h1>
        <p className="max-w-[640px] text-base leading-7 text-muted-foreground">
          {t('PROFILE_SUBTITLE')}
        </p>
      </header>

      <div className="flex flex-col gap-14 lg:flex-row">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-8 rounded-lg border border-border bg-card p-6 md:p-8"
        >
          <PhotoUploadField
            name={profile.displayName}
            photoUrl={photoUrl}
            onUploaded={handlePhoto}
          />

          <div className="flex flex-col gap-6 border-t border-border pt-8">
            <FormInput name="displayName" control={control} label={t('PROFILE_NAME_LABEL')} />

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">
                  {t('PROFILE_BIO_LABEL')}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {bio.length} / {MAX_BIO}
                </span>
              </div>

              <FormTextarea name="bio" control={control} />

              <p className="text-xs leading-5 text-muted-foreground">{t('PROFILE_BIO_HINT')}</p>
            </div>
          </div>

          {/*
            Lessons, tracks and last publication are derived from the content
            itself — showing them here makes it explicit that they are not
            fields the instructor fills in.
          */}
          <div className="flex flex-col gap-4 rounded-md bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              {t('PROFILE_AUTOMATIC')}
            </p>

            <StatStrip
              items={[
                {
                  value: String(profile.stats.lessonCount),
                  label: t('STAT_LESSONS_RECORDED'),
                },
                { value: String(profile.stats.trackCount), label: t('STAT_TRACKS') },
                {
                  value: profile.stats.lastPublishedAt
                    ? formatRelativeDate(profile.stats.lastPublishedAt)
                    : '—',
                  label: profile.stats.lastPublishedAt
                    ? t('STAT_LAST_PUBLISHED')
                    : t('STAT_NEVER_PUBLISHED'),
                },
              ]}
            />
          </div>

          <SubmitButton isLoading={isSubmitting} label={t('PROFILE_SAVE')} disabled={!isDirty} />
        </form>

        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[400px]">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {t('PROFILE_PREVIEW')}
          </p>

          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-7">
            <InstructorAvatar name={profile.displayName} src={photoUrl} size="lg" />

            <h2 className="font-display text-[28px] font-extrabold leading-9 tracking-tight text-foreground">
              {watch('displayName') || profile.displayName}
            </h2>

            <p className="text-sm leading-6 text-muted-foreground">{bio}</p>

            <p className="text-xs text-muted-foreground">
              {t('LESSON_COUNT', { count: profile.stats.lessonCount })} ·{' '}
              {t('TRACK_COUNT', { count: profile.stats.trackCount })}
            </p>

            <Button className="w-full" type="button">
              {t('PROFILE_PREVIEW_CTA', {
                name: profile.displayName,
                price: formatPriceFromCents(profile.monthlyPrice),
              })}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {`guarda.app${publicRoutes.INSTRUCTOR_PROFILE(profile.slug)}`}
          </p>
        </aside>
      </div>
    </PageContainer>
  )
}
