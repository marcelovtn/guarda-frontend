'use client'

import { publicRoutes, studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Checkout shell.
 *
 * Deliberately not the app header: this is a linear flow with a step counter,
 * and offering the full navigation here invites the student to wander off
 * halfway through subscribing.
 */
export default function SubscribeLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation('guarda')
  const pathname = usePathname()
  const step = pathname.includes('checkout') ? 3 : 2

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5 md:px-8 xl:px-16">
        <Link
          href={studentRoutes.HOME}
          className="font-display text-[20px] font-black leading-6 tracking-[-0.01em] text-foreground"
        >
          GUARDA
        </Link>

        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">
            {t('SUBSCRIBE_STEP', { step, total: 3 })}
          </span>
          <Link href={publicRoutes.LOGIN} className="text-sm font-medium text-foreground">
            {t('SUBSCRIBE_EXIT')}
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-5 py-14 md:px-8">{children}</main>
    </div>
  )
}
