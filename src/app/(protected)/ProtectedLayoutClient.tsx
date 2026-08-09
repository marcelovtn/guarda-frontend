'use client'

import SidebarNavigation from '@/components/layout/SidebarNavigation'
import { TopNavigation } from '@/components/layout/TopNavigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { useGetMinimalUserInfo } from '@/lib/userInfo/userInfo.slice'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProtectedLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { i18n } = useTranslation()
  const { data: minimalUserInfo } = useGetMinimalUserInfo()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (minimalUserInfo?.language) {
      i18n.changeLanguage(minimalUserInfo.language)
    }
  }, [minimalUserInfo, i18n])

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {!isMobile && <SidebarNavigation />}
      <div className="flex min-w-0 flex-1 flex-col">
        {isMobile && <TopNavigation />}
        <div className="relative flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
