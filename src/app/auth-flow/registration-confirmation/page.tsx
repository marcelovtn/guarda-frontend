'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authClient } from '@/lib/auth-client'

import { publicRoutes } from '@/utils/routes'

export default function RegistrationConfirmationPage() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const hasVerified = useRef(false)

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return

      try {
        // Better Auth usa 'token' como query param
        const token = searchParams.get('token')
        const error = searchParams.get('error')

        hasVerified.current = true

        // Se há erro na URL (token inválido/expirado)
        if (error) {
          setStatus('error')
          return
        }

        if (!token) {
          setStatus('error')
          return
        }

        // Verifica o email usando o cliente Better Auth
        const { data, error: verifyError } = await authClient.verifyEmail({
          query: {
            token,
          },
        })

        if (verifyError || !data) {
          setStatus('error')
        } else {
          setStatus('success')
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
        setStatus('error')
      }
    }

    verifyEmail()
  }, [searchParams])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {t('LOADING_TITLE')}
            </h3>
            <p className="text-center text-muted-foreground">{t('LOADING_DESC')}</p>
          </div>
        )
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
              <CheckCircle2 className="h-8 w-8 text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold text-violet-600 dark:text-violet-400">
              {t('SUCCESS_TITLE')}
            </h3>
            <p className="max-w-sm text-center text-muted-foreground">{t('SUCCESS_DESC')}</p>
            <Button
              onClick={() => router.push(publicRoutes.AUTH)}
              className="mt-4 w-full bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t('SUCCESS_LOGIN_BUTTON')}
            </Button>
          </div>
        )
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              {t('ERROR_TITLE')}
            </h3>
            <p className="max-w-sm text-center text-muted-foreground">{t('ERROR_DESC')}</p>
            <Button
              onClick={() => router.push(publicRoutes.AUTH)}
              className="mt-4 w-full bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t('BACK_TO_AUTH')}
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">{t('VERIFY_CARD_TITLE')}</CardTitle>
          <CardDescription className="text-center">{t('VERIFY_CARD_DESC')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{renderContent()}</CardContent>
      </Card>
    </div>
  )
}
