'use server'

import { cache } from 'react'
import { cookies } from 'next/headers'

// Normalizar URL do backend (remove barra no final e força IPv4 se for localhost)
function normalizeBackendURL(url: string): string {
  // Remove barra no final se houver
  let normalized = url.replace(/\/$/, '')

  // Em desenvolvimento, força IPv4 para evitar problemas com IPv6
  if (normalized.includes('localhost') && process.env.NODE_ENV !== 'production') {
    normalized = normalized.replace('localhost', '127.0.0.1')
  }

  return normalized
}

function getBackendURL(): string {
  return normalizeBackendURL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
}

/**
 * Obtém a sessão atual do Better Auth (para uso em Server Components e Server Actions)
 *
 * NOTA: Esta é a ÚNICA função de auth que deve ser chamada no servidor.
 * Para operações de login, signup, logout, etc., use o authClient diretamente no cliente:
 *
 * @example
 * // No Client Component:
 * import { authClient } from '@/lib/auth-client'
 *
 * // Login
 * const { data, error } = await authClient.signIn.email({
 *   email: 'user@email.com',
 *   password: 'password'
 * })
 *
 * // Signup
 * const { data, error } = await authClient.signUp.email({
 *   email: 'user@email.com',
 *   password: 'password',
 *   name: 'User Name'
 * })
 *
 * // Logout
 * await authClient.signOut()
 *
 * // Get Session (client-side)
 * const { data: session } = authClient.useSession()
 */
export const getSession = cache(async function getSession() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const cookieHeader = allCookies.map(({ name, value }) => `${name}=${value}`).join('; ')

    const backendURL = getBackendURL()

    const response = await fetch(`${backendURL}/api/auth/get-session`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader,
      },
    })

    if (!response.ok) {
      console.error('[getSession] resposta não ok:', response.status, response.statusText)
      return null
    }

    const result = await response.json()
    return result?.user ? result : null
  } catch (error) {
    console.error('[getSession] erro na requisição:', error)
    return null
  }
})

/**
 * Função auxiliar para obter usuário atual (Server-side)
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

/**
 * Função auxiliar para verificar se usuário está autenticado (Server-side)
 */
export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}
