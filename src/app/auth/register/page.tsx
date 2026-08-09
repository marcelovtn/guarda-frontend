'use client'

import { useSignup } from '../auth.slice'
import { FormInput, FormPasswordInput, SubmitButton } from '@/components/layout/Form'
import { Checkbox } from '@/components/ui/checkbox'
import { publicRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { createRegisterSchema, type RegisterSchema } from './schema'
import type { RegisterFormValues } from '@/lib/auth/types'

export default function RegisterForm() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)
  const emailFromUrl = searchParams.get('email')
  const { mutateAsync: signup } = useSignup()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      username: '',
      email: emailFromUrl || '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: RegisterSchema) {
    if (!termsAccepted) {
      setShowTermsError(true)
      return
    }
    setShowTermsError(false)

    try {
      const payload: RegisterFormValues = {
        username: values.username,
        email: values.email,
        password: values.password,
        timezone:
          (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) ||
          'UTC',
      }

      await signup(payload).then((response) => {
        if (!response.user) return
        localStorage.setItem('confirmationEmail', values.email)
        router.push(publicRoutes.CONFIRM_EMAIL)
      })
    } catch (error) {
      console.error('Erro no registro:', error)
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
            {t('REGISTER_TITLE')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('REGISTER_SUBTITLE')}</p>
        </div>

        <FormInput
          name="username"
          control={control}
          label={t('NAME_LABEL')}
          placeholder={t('NAME_PLACEHOLDER')}
          autoFocus
        />
        <FormInput
          name="email"
          control={control}
          label={t('EMAIL_LABEL')}
          type="text"
          placeholder={t('EMAIL_PLACEHOLDER')}
          disabled={!!emailFromUrl}
        />
        <FormPasswordInput
          name="password"
          control={control}
          label={t('PASSWORD_LABEL')}
          placeholder={t('PASSWORD_PLACEHOLDER')}
          showStrengthIndicator
        />
        <FormPasswordInput
          name="confirmPassword"
          control={control}
          label={t('CONFIRM_PASSWORD_LABEL')}
          placeholder={t('CONFIRM_PASSWORD_PLACEHOLDER')}
          showStrengthIndicator={false}
        />

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="acceptTerms"
              checked={termsAccepted}
              onCheckedChange={(checked) => {
                const isChecked = checked === true
                setTermsAccepted(isChecked)
                if (isChecked) setShowTermsError(false)
              }}
              className="mt-1"
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm leading-snug text-gray-700 dark:text-gray-300"
            >
              {t('TERMS_ACCEPTANCE_TEXT')}
            </label>
          </div>
          {showTermsError && <p className="text-sm text-red-500">{t('TERMS_REQUIRED_ERROR')}</p>}
        </div>

        <SubmitButton isLoading={isSubmitting} label={t('SUBMIT_REGISTER')} />
      </div>

      <div className="flex items-center justify-center space-x-1 text-sm">
        <Link
          href={publicRoutes.AUTH}
          className="text-primary hover:text-primary/80 hover:underline"
        >
          {t('BACK_TO_AUTH')}
        </Link>
      </div>
    </form>
  )
}
