import { authClient } from '@/lib/auth-client'
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from '@/lib/auth/types'
import { translateBetterAuthError } from '@/lib/auth/utils'
import { api } from '@/utils/axios'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
} as const

/**
 * Hook para login usando Better Auth (client-side)
 */
export function useLogin() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const { data: result, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Preserva o objeto de erro do Better Auth para tradução
        throw error
      }

      return result
    },
    onError: (error: any) => {
      const translatedError = translateBetterAuthError(error, t, 'AUTH_LOGIN_FAILED')
      toast.error(translatedError)
    },
  })
}

/**
 * Hook para onboarding de usuário (após login/signup)
 */
export function useOnboardIncomingUser() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async (userId: string) => {
      const navLang = (typeof navigator !== 'undefined' ? navigator.language : 'pt') || 'pt'
      const lang = navLang.startsWith('en') ? 'en' : 'pt'
      const timezone =
        (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC'
      await api.post(`/api/onboardIncomingUser/${userId}`, {
        language: lang,
        timezone,
      })
    },
    onError: (error: any) => {
      toast.error(error?.message || t('AUTH_ONBOARDING_FAILED'))
    },
  })
}

/**
 * Hook para signup usando Better Auth (client-side)
 */
export function useSignup() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const referralCode =
        typeof window !== 'undefined' ? localStorage.getItem('amfinance_session_ref') : undefined
      if (process.env.NODE_ENV === 'development' && referralCode !== undefined) {
        console.log('[SignUp] referralCode enviado:', referralCode ? `"${referralCode}"` : null)
      }
      const { data: result, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
        ...(referralCode ? { referral_code: referralCode } : {}),
      } as Parameters<typeof authClient.signUp.email>[0])

      if (error) {
        // Preserva o objeto de erro do Better Auth para tradução
        throw error
      }

      return result
    },
    onError: (error: any) => {
      const translatedError = translateBetterAuthError(error, t, 'AUTH_SIGNUP_FAILED')
      toast.error(translatedError)
    },
  })
}

/**
 * Hook para forgot password usando Better Auth (client-side)
 */
export function useForgotPassword() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      })

      if (error) {
        // Preserva o objeto de erro do Better Auth para tradução
        throw error
      }

      return true
    },
    onError: (error: any) => {
      const translatedError = translateBetterAuthError(error, t, 'AUTH_FORGOT_FAILED')
      toast.error(translatedError)
    },
  })
}

/**
 * Hook para reset password usando Better Auth (client-side)
 */
export function useResetPassword() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      const { data: result, error } = await authClient.resetPassword({
        newPassword: data.password,
        token: data.code || '',
      })

      if (error) {
        // Preserva o objeto de erro do Better Auth para tradução
        throw error
      }

      return result
    },
    onError: (error: any) => {
      const translatedError = translateBetterAuthError(error, t, 'AUTH_RESET_FAILED')
      toast.error(translatedError)
    },
  })
}

/**
 * Hook para logout usando Better Auth (client-side)
 */
export function useLogout() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()

      if (error) {
        // Preserva o objeto de erro do Better Auth para tradução
        throw error
      }

      return true
    },
    onError: (error: any) => {
      const translatedError = translateBetterAuthError(error, t, 'AUTH_LOGOUT_FAILED')
      toast.error(translatedError)
    },
  })
}

/**
 * Hook para Google OAuth usando Better Auth (client-side)
 */
export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: async () => {
      // Better Auth: usa o método nativo do client
      // O callbackURL DEVE ser a URL COMPLETA do frontend
      const frontendURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${frontendURL}/auth/callback`,
      })

      return { success: true }
    },
  })
}

/**
 * Hook para verificar sessão OAuth callback (depois do redirect)
 */
export function useAuthenticateWithOauthCallback() {
  return useMutation({
    mutationFn: async () => {
      // Após o redirect do OAuth, verifica se a sessão foi criada
      const { data: session } = await authClient.getSession()
      return session
    },
  })
}

/**
 * Hook para verificar email por token (link no email)
 */
export function useVerifyEmail() {
  const { t } = useTranslation('auth')
  return useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await authClient.verifyEmail({
        query: {
          token,
        },
      })

      if (error) {
        // Preserva o objeto de erro do Better Auth para tradução
        throw error
      }

      return data
    },
    onError: (error: any) => {
      const translatedError = translateBetterAuthError(error, t, 'AUTH_VERIFY_CODE_FAILED')
      toast.error(translatedError)
    },
  })
}

/**
 * Hook para verificar se email existe no banco
 */
export function useCheckEmailExists() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/api/auth-custom/check-email', { email })
      return response.data as { exists: boolean }
    },
  })
}

/**
 * Hook alternativo para onboarding (usado em OAuth callback)
 */
export function useOnboardUserById() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const navLang = (typeof navigator !== 'undefined' ? navigator.language : 'pt') || 'pt'
      const lang = navLang.startsWith('en') ? 'en' : 'pt'
      const timezone =
        (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC'
      await api.post(`/api/onboardIncomingUser/${userId}`, {
        language: lang,
        timezone,
      })
    },
    onError: (error: any) => {
      console.warn('Falha no onboarding do usuário:', error)
    },
  })
}
