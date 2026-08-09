import { redirect } from 'next/navigation'
import { studentRoutes } from '@/utils/routes'
import { getSession } from '@/actions/auth'

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Someone already signed in has no use for the sales page — send them to
  // their lessons instead of the pitch.
  const session = await getSession()

  if (session?.user) {
    redirect(studentRoutes.HOME)
  }

  return children
}
