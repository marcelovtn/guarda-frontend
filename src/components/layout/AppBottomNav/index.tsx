'use client'

import type { AppHeaderNavItem } from '@/components/layout/AppHeader/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AppBottomNavProps {
  items: AppHeaderNavItem[]
  /** Matches the dark instructor shell. */
  dark?: boolean
}

/**
 * Primary navigation on a phone, as a tab bar at the bottom of the screen.
 *
 * Replaces the hamburger sheet: on a phone this product is used like an app,
 * and the sections are few enough to sit side by side. A thumb reaches the
 * bottom of the screen; the top-left corner it does not.
 */
export function AppBottomNav({ items, dark = false }: AppBottomNavProps) {
  const pathname = usePathname()

  const isActive = (item: AppHeaderNavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t lg:hidden',
        // Keeps the bar clear of the iOS home indicator.
        'pb-[env(safe-area-inset-bottom)]',
        dark ? 'border-white/10 bg-surface-dark' : 'border-border bg-background',
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = isActive(item)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition-colors',
              active
                ? dark
                  ? 'font-semibold text-white'
                  : 'font-semibold text-foreground'
                : dark
                  ? 'font-medium text-white/55'
                  : 'font-medium text-muted-foreground',
            )}
          >
            {Icon ? <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} /> : null}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
