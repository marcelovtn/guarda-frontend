'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function EmailVerificationPage() {
  const router = useRouter()
  const { t } = useTranslation('auth')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const storedEmail = localStorage.getItem('confirmationEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  return (
    <div className="container mx-auto flex min-h-dvh flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
            <Mail className="h-8 w-8 text-violet-500" />
          </div>
          <CardTitle className="text-center text-2xl">{t('EMAIL_VERIFICATION_TITLE')}</CardTitle>
          <CardDescription className="text-center">
            {t('EMAIL_VERIFICATION_SENT_TO')}
            <div className="mt-1 font-medium text-foreground">{email}</div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <p>{t('EMAIL_VERIFICATION_INSTRUCTIONS')}</p>
            <p>{t('EMAIL_VERIFICATION_TIP')}</p>
          </div>

          <div className="space-y-4 pt-4 text-violet-500">
            <Button onClick={() => router.push('/auth/login')} variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>{t('BACK_TO_LOGIN')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
