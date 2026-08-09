import { redirect } from 'next/navigation'
import ProtectedLayoutClient from './ProtectedLayoutClient'
import { getSession } from '@/actions/auth'

export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login?forceLogin=1')
  }

  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
}
