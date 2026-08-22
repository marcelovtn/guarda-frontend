'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { AccountButton } from '@/components/layout/AppHeader/components/AccountButton'
import { authClient } from '@/lib/auth-client'
import { useGetMinimalUserInfo } from '@/lib/userInfo/userInfo.slice'
import { instructorRoutes, publicRoutes, studentRoutes } from '@/utils/routes'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Shell for every authenticated screen.
 *
 * The blank put a sidebar on desktop and a top bar on mobile. GUARDA is a top
 * bar at every width — all the artboards are horizontal — so this renders
 * AppHeader instead, switching to the dark instructor variant under
 * /instructor.
 *
 * Também é o portão de sessão. Enquanto a sessão não resolve, nada de
 * `children` é renderizado: o portão é assíncrono, e desenhar a tela protegida
 * antes da resposta mostraria conteúdo de quem está logado para quem não está,
 * ainda que por um instante.
 */
export default function ProtectedLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { t, i18n } = useTranslation('guarda')
  const { data: minimalUserInfo } = useGetMinimalUserInfo()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const isSignedIn = Boolean(session?.user)

  const isInstructorArea = pathname.startsWith('/instructor')

  /*
   * Subscribing is a linear flow with its own step counter and its own header.
   * Rendering the app navigation over it both duplicates the wordmark and
   * invites the student to wander off halfway through paying.
   */
  const isCheckoutFlow = pathname.startsWith('/subscribe')

  const items = useMemo(
    () =>
      isInstructorArea
        ? [
            { label: t('NAV_INSTRUCTOR_LESSONS'), href: instructorRoutes.LESSONS },
            { label: t('NAV_INSTRUCTOR_TRACKS'), href: instructorRoutes.TRACKS },
            { label: t('NAV_INSTRUCTOR_STUDENTS'), href: instructorRoutes.STUDENTS },
          ]
        : [
            { label: t('NAV_HOME'), href: studentRoutes.HOME, exact: true },
            { label: t('NAV_TRACKS'), href: studentRoutes.TRACKS },
            { label: t('NAV_VIDEOS'), href: studentRoutes.VIDEOS },
          ],
    [isInstructorArea, t],
  )

  useEffect(() => {
    if (minimalUserInfo?.language) {
      i18n.changeLanguage(minimalUserInfo.language)
    }
  }, [minimalUserInfo, i18n])

  // `forceLogin=1` diz ao middleware para não devolver esta pessoa para /home,
  // o que geraria o laço protegido → login → home → protegido.
  useEffect(() => {
    if (!isPending && !isSignedIn) {
      router.replace(`${publicRoutes.LOGIN}?forceLogin=1`)
    }
  }, [isPending, isSignedIn, router])

  if (isPending || !isSignedIn) {
    return <div className="min-h-dvh bg-background" aria-busy="true" />
  }

  if (isCheckoutFlow) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader
        variant={isInstructorArea ? 'instructor' : 'student'}
        items={items}
        account={<AccountButton dark={isInstructorArea} />}
      />
      <main className="flex-1">{children}</main>
    </div>
  )
}
