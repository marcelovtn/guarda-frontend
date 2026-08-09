import { protectedRoutes } from '@/utils/routes'
import { Home, Settings } from 'lucide-react'
import { MenuOption } from './types'

export const menuOptions: MenuOption[] = [
  {
    label: 'MENU_HOME',
    icon: Home,
    route: protectedRoutes.HOME,
    disabled: false,
  },
  {
    label: 'MENU_SETTINGS',
    icon: Settings,
    route: protectedRoutes.SETTINGS,
    disabled: false,
  },
]
