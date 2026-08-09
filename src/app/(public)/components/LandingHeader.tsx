'use client'

import AmLogo from '@/components/layout/AmLogo/Index'
import SwitchTheme from '@/components/layout/switchTheme'
import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/utils/routes'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function LandingHeader() {
  const router = useRouter()
  const { t: tCommon } = useTranslation('common')

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <AmLogo />
        <div className="flex items-center sm:gap-2 md:gap-4">
          <SwitchTheme />
          <Button
            variant="ghost"
            onClick={() => router.push(publicRoutes.AUTH)}
            className="hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-400"
          >
            {tCommon('HEADER_LOGIN')}
          </Button>
          <Button
            className="relative overflow-hidden bg-violet-600 text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25"
            onClick={() => router.push(publicRoutes.AUTH)}
          >
            {tCommon('HEADER_CREATE_ACCOUNT')}
            <span className="animate-shimmer absolute inset-0 h-full w-full translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Button>
        </div>
      </div>
    </header>
  )
}
