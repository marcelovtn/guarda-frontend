'use client'

import { useOnboardIncomingUser, useSignInWithGoogle, useSignup } from '@/app/auth/auth.slice'
import {
  FormInput,
  FormPasswordInput,
  FormRadioGroup,
  SubmitButton,
} from '@/components/layout/Form'
import { authFeatures } from '@/lib/auth/features'
import { Button } from '@/components/ui/button'
import { publicRoutes, studentRoutes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GoogleIcon } from '../components/GoogleIcon'
import { createRegisterSchema, type RegisterSchema } from './schema'

const BELTS = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'] as const

export default function RegisterPage() {
  const { t } = useTranslation(['guarda', 'auth'])
  const router = useRouter()
  const { mutateAsync: signup } = useSignup()
  const { mutateAsync: onboardIncomingUser } = useOnboardIncomingUser()
  const { mutateAsync: signInWithGoogle } = useSignInWithGoogle()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { username: '', email: '', password: '', belt: 'WHITE' },
  })

  async function onSubmit({ belt, ...values }: RegisterSchema) {
    const response = await signup(values)
    if (!response?.user) return

    // The belt is only used to pick which track to recommend first, so a
    // failure here must not block the sign-up itself.
    try {
      await onboardIncomingUser({ userId: response.user.id, belt })
    } catch (err) {
      console.error('Erro no onboarding:', err)
    }

    router.push(studentRoutes.SUBSCRIBE_PLANS)
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('AUTH_REGISTER_TITLE')}
        </h1>
        <p className="text-base text-muted-foreground">{t('AUTH_REGISTER_SUBTITLE')}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput name="username" control={control} label={t('AUTH_NAME')} />
        <FormInput name="email" control={control} type="email" label={t('AUTH_EMAIL')} />

        <div className="flex flex-col gap-1.5">
          <FormPasswordInput
            name="password"
            control={control}
            label={t('AUTH_PASSWORD')}
            showStrengthIndicator={false}
          />
          <p className="text-xs text-muted-foreground">{t('AUTH_PASSWORD_HINT')}</p>
        </div>

        {/*
          The belt is not a badge — it decides which track the home page offers
          on first access, which is why it is asked for here and nowhere else.
        */}
        <FormRadioGroup
          name="belt"
          control={control}
          label={t('AUTH_BELT_LABEL')}
          options={BELTS.map((value) => ({ value, label: t(`BELT_${value}`) }))}
        />

        <SubmitButton isLoading={isSubmitting} label={t('AUTH_SIGN_UP')} />
      </form>

      {authFeatures.googleSignIn ? (
        <>
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
            className="w-full bg-card"
            onClick={() => signInWithGoogle()}
          >
            <GoogleIcon />
            {t('AUTH_GOOGLE_SIGN_UP')}
          </Button>
        </>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        {t('AUTH_HAS_ACCOUNT')}{' '}
        <Link href={publicRoutes.LOGIN} className="font-semibold text-primary hover:underline">
          {t('AUTH_SIGN_IN')}
        </Link>
      </p>
    </div>
  )
}
