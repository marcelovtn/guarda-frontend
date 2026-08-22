'use client'

import { FormInput, SubmitButton } from '@/components/layout/Form'
import { PageContainer } from '@/components/layout/PageContainer'
import { PhotoUploadField } from '@/components/layout/PhotoUploadField'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { accountSchema, type AccountValues } from './schema'
import { BillingCard } from './components/BillingCard'

export default function AccountPage() {
  const { t } = useTranslation('guarda')
  const { data: session } = authClient.useSession()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', email: '' },
  })

  async function onSubmit(values: AccountValues) {
    await authClient.updateUser({ name: values.name })
    toast.success(t('ACCOUNT_SAVED'))
    reset(values)
  }

  /**
   * Better Auth stores the avatar as a URL on the user, so the uploaded key is
   * resolved to its public URL and written straight back to the session.
   */
  async function handlePhoto(_key: string, url: string) {
    setPhotoUrl(url)
    await authClient.updateUser({ image: url })
  }

  useEffect(() => {
    if (session?.user) {
      reset({ name: session.user.name ?? '', email: session.user.email ?? '' })
      setPhotoUrl(session.user.image ?? null)
    }
  }, [session, reset])

  if (!session?.user) return null

  return (
    <PageContainer className="flex max-w-[900px] flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('ACCOUNT_TITLE')}
        </h1>
        <p className="text-base text-muted-foreground">{t('ACCOUNT_SUBTITLE')}</p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 rounded-lg border border-border bg-card p-6 md:p-8"
      >
        <PhotoUploadField
          name={session.user.name ?? ''}
          photoUrl={photoUrl}
          onUploaded={handlePhoto}
          label={t('ACCOUNT_PHOTO_LABEL')}
          hint={t('ACCOUNT_PHOTO_HINT')}
        />

        <div className="grid gap-5 border-t border-border pt-8 md:grid-cols-2">
          <FormInput name="name" control={control} label={t('ACCOUNT_NAME')} />
          {/* Changing an e-mail means re-verifying it, which belongs to a
              dedicated flow rather than a text field on this page. */}
          <FormInput name="email" control={control} label={t('ACCOUNT_EMAIL')} disabled />
        </div>

        <SubmitButton isLoading={isSubmitting} label={t('ACCOUNT_SAVE')} disabled={!isDirty} />
      </form>

      <BillingCard />
    </PageContainer>
  )
}
