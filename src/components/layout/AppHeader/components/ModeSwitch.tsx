'use client'

import { cn } from '@/lib/utils'
import { useGetInstructorProfile } from '@/lib/instructor/instructor.slice'
import { instructorRoutes, studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

interface ModeSwitchProps {
  /** Rendered against the dark instructor bar. */
  dark?: boolean
}

/**
 * Segmented control between the student and the instructor side.
 *
 * Being an instructor is a row on another table, not a flag on the session, so
 * this only appears for someone who has one. It was buried in the account
 * dropdown before, which made the two halves of the product feel like separate
 * apps you had to go looking for.
 */
export function ModeSwitch({ dark = false }: ModeSwitchProps) {
  const { t } = useTranslation('guarda')
  const pathname = usePathname()
  const { data: instructor } = useGetInstructorProfile()

  if (!instructor) return null

  const isInstructorArea = pathname.startsWith('/instructor')

  const segment = (active: boolean) =>
    cn(
      'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
      active
        ? dark
          ? 'bg-white text-surface-dark'
          : 'bg-foreground text-background'
        : dark
          ? 'text-white/60 hover:text-white'
          : 'text-muted-foreground hover:text-foreground',
    )

  return (
    <div
      className={cn(
        // Hidden on a phone, where the bar has no room for it — the account
        // menu still carries the same jump.
        'hidden items-center gap-0.5 rounded-full p-1 sm:flex',
        dark ? 'bg-white/10' : 'bg-secondary',
      )}
    >
      <Link
        href={studentRoutes.HOME}
        className={segment(!isInstructorArea)}
        aria-current={!isInstructorArea ? 'page' : undefined}
      >
        {t('MODE_STUDENT')}
      </Link>

      <Link
        href={instructorRoutes.LESSONS}
        className={segment(isInstructorArea)}
        aria-current={isInstructorArea ? 'page' : undefined}
      >
        {t('MODE_INSTRUCTOR')}
      </Link>
    </div>
  )
}
