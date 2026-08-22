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
 * ⚠️ NÃO FUNCIONA NO DEPLOY ATUAL. Não use para proteger tela.
 *
 * Lê os cookies que chegaram ao *frontend* e os repassa para a API. Isso só
 * resolve a sessão quando os dois compartilham domínio de cookie. Hoje o
 * frontend está em `web-*.up.railway.app` e a API em `api-*.up.railway.app`:
 * o cookie de sessão é emitido pelo host da API e nunca é enviado ao host do
 * frontend, então esta função devolve `null` para gente logada.
 *
 * Isso passa em desenvolvimento e falha em produção, o que é a pior
 * combinação: no local os dois são `localhost` em portas diferentes, e cookie
 * não distingue porta — então o cookie chega e a função parece correta.
 *
 * Os portões de sessão vivem no cliente, via `authClient.useSession()`. Quando
 * o projeto tiver domínio próprio (`guarda.app` + `api.guarda.app` com
 * `COOKIE_DOMAIN=.guarda.app`), esta função volta a funcionar e pode ser
 * reconsiderada.
 *
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
