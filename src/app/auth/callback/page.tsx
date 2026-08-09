'use client'

import ConnectingAccount from '@/components/layout/ConnectingAccount'
import { authClient } from '@/lib/auth-client'
import { api } from '@/utils/axios'
import { protectedRoutes } from '@/utils/routes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ranRef = useRef(false)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (ranRef.current) return
      ranRef.current = true

      try {
        // Verifica se há erro nos query params
        const error = searchParams.get('error')
        if (error) {
          console.error('OAuth error:', error)
          router.replace(`/auth/login?error=oauth_error`)
          return
        }

        // Com Better Auth, o callback já foi processado pelo backend
        // Os cookies já estão configurados
        // Apenas verificamos a sessão para pegar os dados do usuário
        const { data: session, error: sessionError } = await authClient.getSession()

        if (sessionError || !session) {
          router.replace(`/auth/login?error=oauth_error`)
          return
        }

        // Fazer onboarding do usuário se necessário
        const userId = session.user?.id
        if (userId) {
          try {
            const navLang = (typeof navigator !== 'undefined' ? navigator.language : 'pt') || 'pt'
            const lang = navLang.startsWith('en') ? 'en' : 'pt'
            const timezone =
              (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) ||
              'UTC'
            await api.post(`/api/onboardIncomingUser/${userId}`, {
              language: lang,
              timezone,
            })
          } catch (error) {
            console.warn('Falha no onboarding do usuário:', error)
            // Continua mesmo se o onboarding falhar
          }
        }

        // Redireciona para a home
        router.replace(protectedRoutes.SETTINGS)
      } catch (error) {
        console.error('Erro ao processar callback OAuth:', error)
        router.replace(`/auth/login?error=oauth_error`)
      }
    }

    handleOAuthCallback()
  }, [router, searchParams])

  return <ConnectingAccount />
}
