import { MenuOption } from '@/app/(protected)/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

interface navigationButtonProps {
  menuOption: MenuOption
  handleNavClick?: () => void
}
export function NavigationButton({ menuOption, handleNavClick }: navigationButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation('navigation')
  const Icon = menuOption.icon
  const isActive = pathname === menuOption.route

  function handleNavigation() {
    if (!menuOption.disabled) router.push(menuOption.route)
    if (handleNavClick) handleNavClick()
  }
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'relative w-full justify-start hover:bg-gray-200 dark:hover:bg-accent',
        isActive && 'bg-violet-50 dark:bg-violet-950/30',
        menuOption.disabled && 'opacity-80',
      )}
      onClick={handleNavigation}
      disabled={menuOption.disabled}
    >
      <Icon className={cn('mr-2 h-4 w-4', isActive && 'text-primary')} />
      <span className={cn(isActive && 'text-primary')}>{t(menuOption.label as any)}</span>

      {isActive && <div className="absolute left-0 top-0 h-full w-1 rounded-r bg-primary" />}
    </Button>
  )
}
