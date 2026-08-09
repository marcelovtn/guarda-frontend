import { redirect } from 'next/navigation'
import { protectedRoutes } from '@/utils/routes'
import { getSession } from '@/actions/auth'

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Better Auth: Verifica se o usuário já está autenticado
  const session = await getSession()

  // Se já houver sessão, redireciona para home
  if (session?.user) {
    redirect(protectedRoutes.SETTINGS)
  }

  return children
}
