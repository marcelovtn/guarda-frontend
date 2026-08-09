'use client'

import { useLogin, useOnboardIncomingUser, useSignInWithGoogle } from '@/app/auth/auth.slice'
import { FormInput, FormPasswordInput, SubmitButton } from '@/components/layout/Form'
import ConnectingAccount from '@/components/layout/ConnectingAccount'
import { Button } from '@/components/ui/button'
import { TOAST_ERROR_TIMEOUT_MS } from '@/lib/errors'
import { publicRoutes, studentRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { GoogleIcon } from '../components/GoogleIcon'
import { createLoginSchema, type LoginSchema } from './schema'

export default function LoginPage() {
  const { t } = useTranslation(['guarda', 'auth'])
  const [isFinalizingLogin, setIsFinalizingLogin] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync: login } = useLogin()
  const { mutateAsync: onboardIncomingUser } = useOnboardIncomingUser()
  const { mutateAsync: signInWithGoogle } = useSignInWithGoogle()
  const error = searchParams.get('error')

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: searchParams.get('email') ?? '', password: '' },
  })

  async function onSubmit(values: LoginSchema) {
    const response = await login(values)
    if (!response?.user) return

    setIsFinalizingLogin(true)
    try {
      // Creates the UserInfo row for anyone who signed up before it existed.
      // A failure here must not block the login itself.
      await onboardIncomingUser(response.user.id)
    } catch (err) {
      console.error('Erro no onboarding:', err)
    } finally {
      router.push(studentRoutes.HOME)
      setIsFinalizingLogin(false)
    }
  }

  useEffect(() => {
    if (error === 'oauth_error' && !toast.isActive('error-toast')) {
      setTimeout(() => {
        toast.error(t('auth:OAUTH_ERROR_TOAST'), {
          toastId: 'error-toast',
          autoClose: TOAST_ERROR_TIMEOUT_MS,
        })
      }, 100)
    }
  }, [error, t])

  if (isFinalizingLogin) return <ConnectingAccount />

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('AUTH_LOGIN_TITLE')}
        </h1>
        <p className="text-base text-muted-foreground">{t('AUTH_LOGIN_SUBTITLE')}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput name="email" control={control} type="email" label={t('AUTH_EMAIL')} />

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-foreground">{t('AUTH_PASSWORD')}</span>
            <Link
              href={publicRoutes.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              {t('AUTH_FORGOT')}
            </Link>
          </div>
          <FormPasswordInput name="password" control={control} showStrengthIndicator={false} />
        </div>

        <SubmitButton isLoading={isSubmitting} label={t('AUTH_SIGN_IN')} />
      </form>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium tracking-caps text-muted-foreground">
          {t('AUTH_OR')}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-14 w-full bg-card"
        onClick={() => signInWithGoogle()}
      >
        <GoogleIcon />
        {t('AUTH_GOOGLE_SIGN_IN')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('AUTH_NO_ACCOUNT')}{' '}
        <Link href={publicRoutes.REGISTER} className="font-semibold text-primary hover:underline">
          {t('AUTH_CREATE_ACCOUNT')}
        </Link>
      </p>
    </div>
  )
}
