import { createAuthClient } from 'better-auth/react'

// Cliente Better Auth para uso no React (componentes cliente)
// Aponta para o backend separado onde está a instância real do Better Auth
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  // Garante que os cookies são enviados em requisições cross-origin
  fetchOptions: {
    credentials: 'include',
  },
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
})
