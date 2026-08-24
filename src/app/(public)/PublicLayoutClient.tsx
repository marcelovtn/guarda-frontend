'use client'

import { authClient } from '@/lib/auth-client'
import { studentRoutes } from '@/utils/routes'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Manda quem já está logado para as aulas em vez da página de vendas.
 *
 * Diferente do portão protegido, aqui a landing é desenhada de imediato e o
 * redirect acontece se e quando a sessão resolver. Esconder a página pública
 * atrás de uma checagem de sessão faria o visitante anônimo — que é o público
 * dela — esperar por uma resposta que não lhe diz respeito.
 */
export function PublicLayoutClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(studentRoutes.HOME)
    }
  }, [isPending, session, router])

  return <>{children}</>
}
