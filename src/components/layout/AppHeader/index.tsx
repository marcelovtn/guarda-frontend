'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { InstructorSwitcher } from './components/InstructorSwitcher'
import type { AppHeaderNavItem, AppHeaderVariant } from './types'

interface AppHeaderProps {
  variant: AppHeaderVariant
  items: AppHeaderNavItem[]
  /** Rendered on the right, before the account button. */
  actions?: ReactNode
  /** The switcher, shown on the student header only. */
  instructor?: { name: string; photoUrl?: string | null } | null
  /** Account button, kept as a slot so the header does not own session state. */
  account?: ReactNode
}

/**
 * The application shell header.
 *
 * Replaces the blank's sidebar-on-desktop layout: every GUARDA artboard is a
 * horizontal bar at 1440px. Two variants — light for the student, dark for the
 * instructor — because the instructor side is a different mode of the product,
 * not a different page of the same one.
 */
export function AppHeader({ variant, items, actions, instructor, account }: AppHeaderProps) {
  const pathname = usePathname()
  const isInstructor = variant === 'instructor'

  const isActive = (item: AppHeaderNavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-[72px] w-full shrink-0 items-center justify-between gap-4 px-5 md:px-8 xl:px-16',
        isInstructor
          ? 'bg-surface-dark text-surface-dark-foreground'
          : 'border-b border-border bg-background text-foreground',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={items[0]?.href ?? '/'}
          className="shrink-0 font-display text-[20px] font-black leading-6 tracking-[-0.01em]"
        >
          GUARDA
        </Link>

        {isInstructor ? (
          <span className="bg-white/12 hidden rounded-sm px-2 py-1 text-[11px] font-semibold tracking-caps text-white/70 sm:inline">
            PROFESSOR
          </span>
        ) : null}

        {!isInstructor && instructor ? (
          <InstructorSwitcher name={instructor.name} photoUrl={instructor.photoUrl} />
        ) : null}

        <nav className="ml-8 hidden items-center gap-7 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm leading-[18px] transition-colors',
                isActive(item)
                  ? cn('font-semibold', isInstructor ? 'text-white' : 'text-foreground')
                  : cn(
                      'font-medium',
                      isInstructor
                        ? 'text-white/55 hover:text-white/80'
                        : 'text-muted-foreground hover:text-foreground',
                    ),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {actions}
        {account}
      </div>
    </header>
  )
}

export type { AppHeaderNavItem, AppHeaderVariant }
