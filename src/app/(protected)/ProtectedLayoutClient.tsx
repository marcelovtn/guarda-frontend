'use client'

import { AppBottomNav } from '@/components/layout/AppBottomNav'
import { AppHeader } from '@/components/layout/AppHeader'
import { AccountButton } from '@/components/layout/AppHeader/components/AccountButton'
import { ModeSwitch } from '@/components/layout/AppHeader/components/ModeSwitch'
import { useGetMinimalUserInfo } from '@/lib/userInfo/userInfo.slice'
import { instructorRoutes, studentRoutes } from '@/utils/routes'
import { Home, Layers, MonitorPlay, User, Users, Video } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Shell for every authenticated screen.
 *
 * The blank put a sidebar on desktop and a top bar on mobile. GUARDA is a top
 * bar at every width — all the artboards are horizontal — so this renders
 * AppHeader instead, switching to the dark instructor variant under
 * /instructor.
 */
export default function ProtectedLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { t, i18n } = useTranslation('guarda')
  const { data: minimalUserInfo } = useGetMinimalUserInfo()
  const pathname = usePathname()

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
            { label: t('NAV_INSTRUCTOR_LESSONS'), href: instructorRoutes.LESSONS, icon: Video },
            { label: t('NAV_INSTRUCTOR_TRACKS'), href: instructorRoutes.TRACKS, icon: Layers },
            { label: t('NAV_INSTRUCTOR_STUDENTS'), href: instructorRoutes.STUDENTS, icon: Users },
            { label: t('NAV_INSTRUCTOR_PROFILE'), href: instructorRoutes.PROFILE, icon: User },
          ]
        : [
            { label: t('NAV_HOME'), href: studentRoutes.HOME, exact: true, icon: Home },
            { label: t('NAV_TRACKS'), href: studentRoutes.TRACKS, icon: Layers },
            { label: t('NAV_VIDEOS'), href: studentRoutes.VIDEOS, icon: MonitorPlay },
          ],
    [isInstructorArea, t],
  )

  useEffect(() => {
    if (minimalUserInfo?.language) {
      i18n.changeLanguage(minimalUserInfo.language)
    }
  }, [minimalUserInfo, i18n])

  if (isCheckoutFlow) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader
        variant={isInstructorArea ? 'instructor' : 'student'}
        items={items}
        // Renders itself away for anyone who is not an instructor.
        actions={<ModeSwitch dark={isInstructorArea} />}
        account={<AccountButton dark={isInstructorArea} />}
      />
      {/* Bottom padding clears the tab bar, which is fixed over the page. */}
      <main className="flex-1 pb-[68px] lg:pb-0">{children}</main>

      <AppBottomNav items={items} dark={isInstructorArea} />
    </div>
  )
}
