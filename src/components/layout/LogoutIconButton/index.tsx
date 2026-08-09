'use client'

import { useLogout } from '@/app/auth/auth.slice'
import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/utils/routes'
import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

type LogoutIconButtonProps = React.ComponentProps<typeof Button> & {
  showLabel?: boolean
}

export function LogoutIconButton({
  showLabel = false,
  size: passedSize,
  ...rest
}: LogoutIconButtonProps) {
  const { t } = useTranslation('navigation')
  const { mutateAsync: logout, isPending } = useLogout()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    localStorage.removeItem('currency')
    localStorage.removeItem('language')
    localStorage.removeItem('timezone')
    router.push(publicRoutes.LOGIN)
  }

  const size = showLabel ? passedSize : 'icon'
  const logoutLabel = isPending ? t('LOGOUT_LOADING') : t('LOGOUT')

  return (
    <Button size={size} variant="outline" onClick={handleLogout} disabled={isPending} {...rest}>
      {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
      {showLabel ? logoutLabel : <span className="sr-only">{logoutLabel}</span>}
    </Button>
  )
}
