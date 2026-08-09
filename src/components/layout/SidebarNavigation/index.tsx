'use client'

import { menuOptions } from '@/app/(protected)/utils'
import { SettingsDialog } from '@/components/layout/SettingsDialog'
import { UserProfileButton } from '@/components/layout/UserProfileButton'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetMinimalUserInfo } from '@/lib/userInfo/userInfo.slice'
import { BarChart3 } from 'lucide-react'
import { useState } from 'react'
import AmLogo from '../AmLogo/Index'
import { NavigationButton } from '../NavigationButton'
import { protectedRoutes } from '@/utils/routes'

export default function SidebarNavigation() {
  const [openSettings, setOpenSettings] = useState(false)
  const { data: minimalUserInfo } = useGetMinimalUserInfo()

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-background-darker p-4">
      <div className="mb-8 flex items-end space-x-2">
        <AmLogo />
      </div>
      <nav className="flex-1 space-y-2">
        {menuOptions.map((option) => (
          <TooltipProvider key={option.label}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <NavigationButton menuOption={option} />
                </div>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))}

        {minimalUserInfo?.is_god && (
          <NavigationButton
            menuOption={{
              label: 'Owner',
              icon: BarChart3,
              route: protectedRoutes.OWNER,
              disabled: false,
            }}
          />
        )}
      </nav>

      <UserProfileButton />
      <SettingsDialog open={openSettings} setOpen={setOpenSettings} />
    </aside>
  )
}
