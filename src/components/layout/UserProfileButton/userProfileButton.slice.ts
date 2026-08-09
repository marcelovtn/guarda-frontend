import { authClient } from '@/lib/auth-client'
import { useMemo } from 'react'

/**
 * Hook para obter a sessão do usuário (client-side)
 * Usa o Better Auth client
 *
 * Estrutura: session.data.user
 */
export function useGetUserSession() {
  const session = authClient.useSession()

  // Converte a estrutura do Better Auth para ser compatível com o código existente
  const compatibleData = useMemo(() => {
    if (!session.data?.user) {
      return {
        data: null,
        isPending: session.isPending,
        isLoading: session.isPending,
        error: session.error,
      }
    }

    // Mapeia os campos do Better Auth para a estrutura esperada pelo código
    return {
      data: {
        data: {
          user: {
            id: session.data.user.id,
            email: session.data.user.email,
            user_metadata: {
              email: session.data.user.email,
              name: session.data.user.name,
              display_name: session.data.user.name,
              avatar_url: session.data.user.image,
            },
          },
        },
      },
      isPending: session.isPending,
      isLoading: session.isPending,
      error: session.error,
    }
  }, [session])

  return compatibleData
}
