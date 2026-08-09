'use client'

import { useLogin, useOnboardIncomingUser } from '@/app/auth/auth.slice'
import { FormInput, FormPasswordInput, SubmitButton } from '@/components/layout/Form'
import ConnectingAccount from '@/components/layout/ConnectingAccount'
import { Button } from '@/components/ui/button'
import { TOAST_ERROR_TIMEOUT_MS } from '@/lib/errors'
import { protectedRoutes, publicRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { createLoginSchema, type LoginSchema } from './schema'

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common'])
  const [isFinalizingLogin, setIsFinalizingLogin] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync: login } = useLogin()
  const { mutateAsync: onboardIncomingUser } = useOnboardIncomingUser()
  const error = searchParams.get('error')
  const emailFromUrl = searchParams.get('email')

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: emailFromUrl || '', password: '' },
  })

  async function onSubmit(values: LoginSchema) {
    try {
      const response = await login(values)
      if (!response?.user) return

      setIsFinalizingLogin(true)
      try {
        await onboardIncomingUser(response.user.id)
        router.push(protectedRoutes.SETTINGS)
      } catch (err) {
        console.error('Erro no onboarding:', err)
        router.push(protectedRoutes.SETTINGS)
      } finally {
        setIsFinalizingLogin(false)
      }
    } catch (err) {
      console.error('Erro no login:', err)
    }
  }

  useEffect(() => {
    if (error === 'oauth_error') {
      if (!toast.isActive('error-toast')) {
        setTimeout(() => {
          toast.error(t('OAUTH_ERROR_TOAST'), {
            toastId: 'error-toast',
            autoClose: TOAST_ERROR_TIMEOUT_MS,
          })
        }, 100)
      }
    }
  }, [error, t])

  if (isFinalizingLogin) {
    return <ConnectingAccount />
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('LOGIN_TITLE')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('LOGIN_SUBTITLE')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('EMAIL_LABEL')}
            </span>
            {emailFromUrl && (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                onClick={() => router.push(publicRoutes.AUTH)}
              >
                {t('EDIT_EMAIL_BUTTON')}
              </Button>
            )}
          </div>
          <FormInput
            name="email"
            control={control}
            type="email"
            placeholder={t('EMAIL_PLACEHOLDER')}
            disabled={!!emailFromUrl}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('PASSWORD_LABEL')}
            </span>
            <Link
              href={publicRoutes.FORGOT_PASSWORD}
              className="text-sm text-primary hover:text-primary/80 hover:underline"
            >
              {t('FORGOT_PASSWORD_LINK')}
            </Link>
          </div>
          <FormPasswordInput
            name="password"
            control={control}
            placeholder={t('PASSWORD_PLACEHOLDER')}
            showStrengthIndicator={false}
          />
        </div>

        <SubmitButton isLoading={isSubmitting} label={t('SUBMIT_LOGIN')} />
      </form>

      <div className="flex justify-center text-center text-sm">
        <Link
          href={publicRoutes.AUTH}
          className="text-primary hover:text-primary/80 hover:underline"
        >
          {t('BACK_TO_AUTH')}
        </Link>
      </div>
    </div>
  )
}
