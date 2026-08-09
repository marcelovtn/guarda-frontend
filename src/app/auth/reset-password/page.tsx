'use client'

import { FormPasswordInput, SubmitButton } from '@/components/layout/Form'
import { authClient } from '@/lib/auth-client'
import { translateBetterAuthError } from '@/lib/auth/utils'
import { TOAST_ERROR_TIMEOUT_MS } from '@/lib/errors'
import { publicRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { createResetPasswordSchema, type ResetPasswordSchema } from './schema'

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const error = searchParams.get('error')

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordSchema) {
    if (!token) {
      toast.error(t('RESET_LINK_EXPIRED_TOAST'))
      return
    }

    try {
      const { data, error: resetError } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      })

      if (resetError) {
        const translatedError = translateBetterAuthError(resetError, t, 'AUTH_RESET_FAILED')
        toast.error(translatedError)
        return
      }

      if (data) {
        toast.success(t('RESET_SUCCESS_TOAST'))
        router.push(publicRoutes.LOGIN)
      }
    } catch (err: any) {
      console.error('Erro ao resetar senha:', err)
      const translatedError = translateBetterAuthError(err, t, 'AUTH_RESET_FAILED')
      toast.error(translatedError)
    }
  }

  useEffect(() => {
    if (!token || error === 'INVALID_TOKEN') {
      if (!toast.isActive('error-toast')) {
        setTimeout(() => {
          toast.error(t('RESET_LINK_EXPIRED_TOAST'), {
            toastId: 'error-toast',
            autoClose: TOAST_ERROR_TIMEOUT_MS,
          })
        }, 100)
      }
    }
  }, [token, error, t])

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('RESET_TITLE')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('RESET_SUBTITLE')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
        <FormPasswordInput
          name="password"
          control={control}
          label={t('NEW_PASSWORD_LABEL')}
          placeholder={t('NEW_PASSWORD_PLACEHOLDER')}
          showStrengthIndicator
        />
        <FormPasswordInput
          name="confirmPassword"
          control={control}
          label={t('CONFIRM_NEW_PASSWORD_LABEL')}
          placeholder={t('CONFIRM_NEW_PASSWORD_PLACEHOLDER')}
          showStrengthIndicator={false}
        />
        <SubmitButton
          isLoading={isSubmitting}
          label={t('SUBMIT_RESET')}
          disabled={!token || error === 'INVALID_TOKEN'}
        />
      </form>
    </div>
  )
}
