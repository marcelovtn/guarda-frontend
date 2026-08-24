'use client'

import { useCheckEmailExists, useSignInWithGoogle } from '@/app/auth/auth.slice'
import { authFeatures } from '@/lib/auth/features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { publicRoutes } from '@/utils/routes'
import { Loader2, Orbit } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function UnifiedAuthPage() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const { mutateAsync: checkEmail } = useCheckEmailExists()
  const [isChecking, setIsChecking] = useState(false)
  const { mutateAsync: signInWithGoogle } = useSignInWithGoogle()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailContinue = async () => {
    setIsChecking(true)
    console.log('email', email)
    setEmailError('')

    if (!email) {
      setEmailError(t('EMAIL_REQUIRED'))
      setIsChecking(false)
      return
    }

    if (!validateEmail(email)) {
      setEmailError(t('EMAIL_INVALID'))
      setIsChecking(false)
      return
    }

    try {
      const result = await checkEmail(email)

      if (result.exists) {
        router.push(`${publicRoutes.LOGIN}?email=${encodeURIComponent(email)}`)
      } else {
        router.push(`${publicRoutes.REGISTER}?email=${encodeURIComponent(email)}`)
      }
      setIsChecking(false)
    } catch (error: any) {
      setIsChecking(false)
      toast.error(error?.message || t('ERROR_UNKNOWN'))
    }
  }

  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailContinue()
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="mb-8 flex flex-col items-center space-y-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/20">
          <Orbit className="h-8 w-8 text-violet-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('UNIFIED_AUTH_TITLE')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('UNIFIED_AUTH_SUBTITLE')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {authFeatures.googleSignIn ? (
          <Button
            className="flex w-full items-center justify-center dark:bg-white"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <Image
              src="/google.svg"
              alt={t('GOOGLE_LOGO_ALT')}
              width={24}
              height={24}
              className="mr-2 object-contain"
              priority
            />
            {t('GOOGLE_LOGIN_BUTTON')}
          </Button>
        ) : null}

        <Button
          className="flex w-full items-center justify-center dark:bg-white"
          type="button"
          disabled
        >
          <Image
            src="/microsoft.svg"
            alt="Logo da Microsoft"
            width={24}
            height={24}
            className="mr-2 object-contain"
            priority
          />
          {t('MICROSOFT_LOGIN_BUTTON')}
        </Button>

        <Button
          className="flex w-full items-center justify-center dark:bg-white"
          type="button"
          disabled
        >
          <Image
            src="/apple.svg"
            alt="Logo da Apple"
            width={24}
            height={24}
            className="mr-2 object-contain"
            priority
          />
          {t('APPLE_LOGIN_BUTTON')}
        </Button>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-muted-foreground">{t('OR')}</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('EMAIL_LABEL')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('EMAIL_PLACEHOLDER')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
            onKeyPress={handleKeyPress}
            className={emailError ? 'border-red-500' : ''}
            autoComplete="email"
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <Button className="w-full" onClick={handleEmailContinue} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('CHECKING_EMAIL')}
            </>
          ) : (
            t('EMAIL_CONTINUE_BUTTON')
          )}
        </Button>
      </div>
    </div>
  )
}
