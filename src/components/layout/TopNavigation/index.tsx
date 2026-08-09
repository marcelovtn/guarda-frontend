'use client'

import { menuOptions } from '@/app/(protected)/utils'
import SwitchTheme from '@/components/layout/switchTheme'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { useGetMinimalUserInfo } from '@/lib/userInfo/userInfo.slice'
import { publicRoutes, protectedRoutes } from '@/utils/routes'
import { BarChart3, LogOut, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AmLogo from '../AmLogo/Index'
import { NavigationButton } from '../NavigationButton'
import { UserProfileButton } from '../UserProfileButton'
import { useLogout } from '@/app/auth/auth.slice'

export function TopNavigation() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { mutate: logout } = useLogout()
  const { t } = useTranslation('navigation')

  async function handleLogout() {
    logout()
    localStorage.removeItem('currency')
    localStorage.removeItem('language')
    localStorage.removeItem('timezone')
    router.push(publicRoutes.LOGIN)
  }

  return (
    <header className="z-40 flex w-full items-center justify-between border-b bg-background-darker p-4">
      <div className="flex items-center gap-2">{isMobile && <NavigationMenu />}</div>
      <div className="flex items-center gap-2">
        <SwitchTheme />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant={'outline'} onClick={handleLogout}>
                <LogOut />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-muted text-black dark:text-white">
              <p>{t('LOGOUT')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

function NavigationMenu() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('navigation')
  const { data: minimalUserInfo } = useGetMinimalUserInfo()

  function handleNavClick() {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <SheetTitle className="sr-only">{t('NAV_MENU_TITLE')}</SheetTitle>
          <SheetDescription className="sr-only">{t('NAV_MENU_DESCRIPTION')}</SheetDescription>
          <div className="flex items-end space-x-2 border-b p-4">
            <AmLogo />
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {menuOptions.map((option) => (
              <TooltipProvider key={option.label}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <NavigationButton menuOption={option} handleNavClick={handleNavClick} />
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            ))}

            {minimalUserInfo?.is_god && (
              <NavigationButton
                handleNavClick={handleNavClick}
                menuOption={{
                  label: 'Owner',
                  icon: BarChart3,
                  route: protectedRoutes.OWNER,
                  disabled: false,
                }}
              />
            )}
          </nav>
          <div className="p-4">
            <UserProfileButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
