'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { AccountButton } from '@/components/layout/AppHeader/components/AccountButton'
import { useGetMinimalUserInfo } from '@/lib/userInfo/userInfo.slice'
import { instructorRoutes, studentRoutes } from '@/utils/routes'
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
