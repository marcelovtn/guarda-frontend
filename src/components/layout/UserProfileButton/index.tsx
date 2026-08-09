import { useLogout } from '@/app/auth/auth.slice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useSubscriptionStatus } from '@/hooks/use-subscription'
import { publicRoutes } from '@/utils/routes'
import {
  ChevronDown,
  LogOut,
  MailQuestion,
  MessageCircleQuestion,
  MessageSquarePlus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUserSession } from './userProfileButton.slice'

function getDaysRemaining(trialEnd: string): number {
  const end = new Date(trialEnd)
  const now = new Date()
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

// interface UserProfileButtonProps {
//   setOpenFeedback?: (open: boolean) => void
//   setOpenDonation?: (open: boolean) => void
//   setOpenPremium?: (open: boolean) => void
// }

export function UserProfileButton() {
  const { data, isLoading } = useGetUserSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout()
  const { t } = useTranslation('user')
  const userId = data?.data?.user?.id ?? ''
  const { data: subscription } = useSubscriptionStatus(userId)

  const linkContact = 'mailto:support@jupter.app'
  const linkClickup = 'https://forms.clickup.com/9011749636/f/8cj8rr4-1311/81C71ZYHUPW8VPU05R'

  async function handleLogout() {
    await logout()
    router.push(publicRoutes.LOGIN)
    localStorage.removeItem('currency')
    localStorage.removeItem('language')
    localStorage.removeItem('timezone')
  }
  const userMetadata = useMemo(() => data?.data?.user?.user_metadata, [data])

  const trialLabel = useMemo(() => {
    if (subscription?.status !== 'trialing' || !subscription.trialEnd) return null
    const days = getDaysRemaining(subscription.trialEnd)
    if (days === 0) return t('TRIAL_EXPIRES_TODAY')
    return t('TRIAL_DAYS', { count: days })
  }, [subscription, t])

  const trialColor = useMemo(() => {
    if (!subscription?.trialEnd) return ''
    const days = getDaysRemaining(subscription.trialEnd)
    return days <= 2 ? 'text-red-500 dark:text-red-400' : 'text-violet-600 dark:text-violet-400'
  }, [subscription?.trialEnd])

  function getUserName() {
    if (userMetadata?.display_name) return userMetadata?.display_name
    if (userMetadata?.name) return userMetadata?.name
    if (userMetadata?.email) return userMetadata?.email
    return t('USER_FALLBACK')
  }

  return (
    <>
      {isLoading ? (
        <UserProfileButtonSkeleton />
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              variant="ghost"
              className="w-full !justify-start p-2 hover:bg-gray-200 dark:hover:bg-accent"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={userMetadata?.avatar_url ?? undefined} alt="MV" />
                <AvatarFallback>
                  {(userMetadata?.display_name?.slice(0, 2) || 'US').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden text-sm">
                <span className="w-full truncate text-left text-sm font-medium">
                  {getUserName()}
                </span>
                <span className="w-full truncate text-left text-xs text-muted-foreground">
                  {userMetadata?.email}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] max-w-[90vw]"
            align="center"
            side="top"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex min-w-0 flex-col space-y-1 overflow-hidden">
                <p className="w-full truncate text-sm font-medium leading-none">{getUserName()}</p>
                <p className="w-full truncate text-xs leading-none text-muted-foreground">
                  {userMetadata?.email}
                </p>
                {trialLabel && (
                  <p className={`w-full truncate text-xs leading-none ${trialColor}`}>
                    {trialLabel}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  window.open(linkClickup, '_blank')
                }}
              >
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                <span>{t('MENU_FEEDBACK')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  window.open(linkContact, '_blank')
                }}
              >
                <MailQuestion className="mr-2 h-4 w-4" />
                <span>{t('MENU_SUPPORT_EMAIL')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  window.open('https://wa.me/5585991453111', '_blank')
                }}
              >
                <MessageCircleQuestion className="mr-2 h-4 w-4" />
                <span>{t('MENU_SUPPORT_WHATSAPP')}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setIsOpen(false)
                router.push(protectedRoutes.SETTINGS)
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setIsOpen(false)
                handleLogout()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('MENU_LOGOUT')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={isLoggingOut}>
        <DialogContent
          className="flex flex-col items-center gap-4 p-8"
          onInteractOutside={(e) => e.preventDefault()}
          hideClose
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">{t('MENU_LOGOUT_LOADING')}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function UserProfileButtonSkeleton() {
  return (
    <Button
      size="lg"
      variant="ghost"
      className="w-full p-2 hover:bg-gray-200 dark:hover:bg-accent"
      disabled
    >
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-1 flex-col items-start gap-1 text-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  )
}
