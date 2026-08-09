'use client'

import { useForgotPassword } from '../auth.slice'
import { FormInput, SubmitButton } from '@/components/layout/Form'
import { publicRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { createForgotPasswordSchema, type ForgotPasswordSchema } from './schema'

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const { mutateAsync: forgotPassword } = useForgotPassword()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordSchema) {
    try {
      await forgotPassword(values)
      toast.success(t('FORGOT_SUCCESS_TOAST'))
      router.push(publicRoutes.AUTH)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-md space-y-4"
      autoComplete="off"
    >
      <div className="space-y-6">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('FORGOT_TITLE')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('FORGOT_SUBTITLE')}</p>
        </div>

        <FormInput
          name="email"
          control={control}
          label={t('EMAIL_LABEL')}
          type="email"
          placeholder={t('EMAIL_PLACEHOLDER')}
        />

        <SubmitButton isLoading={isSubmitting} label={t('SUBMIT_FORGOT')} />

        <div className="flex flex-col space-y-2 text-center text-sm">
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-500 dark:text-gray-400">
              {t('REMEMBERED_PASSWORD_QUESTION')}
            </span>
            <Link
              href={publicRoutes.AUTH}
              className="text-primary hover:text-primary/80 hover:underline"
            >
              {t('BACK_TO_AUTH')}
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
