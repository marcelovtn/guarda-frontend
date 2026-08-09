'use client'

import { useLogout } from '@/app/auth/auth.slice'
import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'
import { useGetInstructorProfile } from '@/lib/instructor/instructor.slice'
import { instructorRoutes, publicRoutes, studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

interface AccountButtonProps {
  dark?: boolean
}

/**
 * The signed-in user's avatar and menu, at the right of the header.
 *
 * Replaces the blank's UserProfileButton, which carried trial and donation
 * items from a different product.
 */
export function AccountButton({ dark = false }: AccountButtonProps) {
  const { t } = useTranslation('guarda')
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { mutateAsync: logout } = useLogout()
  const pathname = usePathname()

  /*
   * Being an instructor is a row the session knows nothing about, so it has to
   * be fetched. Without this the only way into the instructor area was typing
   * the URL: an instructor signs in, lands on the student home, and the two
   * sides of the product have no door between them.
   */
  const { data: instructor } = useGetInstructorProfile()
  const isInstructorArea = pathname.startsWith('/instructor')

  const name = session?.user?.name ?? ''
  const photoUrl = session?.user?.image ?? null

  async function handleLogout() {
    await logout()
    router.push(publicRoutes.LOGIN)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <InstructorAvatar
          name={name || '?'}
          src={photoUrl}
          size="sm"
          // The fallback is surface-dark, which would vanish into the dark
          // instructor bar without a ring to separate it.
          className={dark ? 'ring-1 ring-white/25' : undefined}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {name ? (
          <>
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {instructor ? (
          <DropdownMenuItem asChild>
            <Link href={isInstructorArea ? studentRoutes.HOME : instructorRoutes.LESSONS}>
              {isInstructorArea ? t('NAV_SWITCH_TO_STUDENT') : t('NAV_SWITCH_TO_INSTRUCTOR')}
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem asChild>
          <Link href={studentRoutes.ACCOUNT}>{t('NAV_ACCOUNT')}</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleLogout}>{t('NAV_LOGOUT')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Kept so the header can style the trigger against a dark bar if needed. */
export type { AccountButtonProps }
