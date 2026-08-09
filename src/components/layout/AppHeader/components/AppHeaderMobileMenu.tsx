'use client'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppHeaderNavItem } from '../types'

interface AppHeaderMobileMenuProps {
  items: AppHeaderNavItem[]
  isActive: (item: AppHeaderNavItem) => boolean
  dark: boolean
}

/**
 * Navigation below the lg breakpoint, where the horizontal links do not fit.
 *
 * Closes on navigation — without that, tapping a link leaves the sheet open
 * over the page it just opened.
 */
export function AppHeaderMobileMenu({ items, isActive, dark }: AppHeaderMobileMenuProps) {
  const { t } = useTranslation('guarda')
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t('NAV_MENU')}
        className={cn(
          '-ml-1 flex size-9 shrink-0 items-center justify-center rounded-md lg:hidden',
          dark ? 'text-white/80 hover:bg-white/10' : 'text-foreground hover:bg-secondary',
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-0">
        <SheetTitle className="px-6 pb-2 pt-6 font-display text-[20px] font-black tracking-[-0.01em]">
          GUARDA
        </SheetTitle>

        <nav className="flex flex-col px-3 py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-md px-3 py-3 text-base transition-colors',
                isActive(item)
                  ? 'bg-secondary font-semibold text-foreground'
                  : 'font-medium text-muted-foreground hover:bg-secondary/60',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
