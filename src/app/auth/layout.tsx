'use client'

import { StatStrip } from '@/components/layout/StatStrip'
import { usePlatformStats } from '@/lib/platform/platform.slice'
import { publicRoutes } from '@/utils/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Split layout for the auth screens.
 *
 * The blank centred a card. The artboards put a dark statement panel on the
 * left and the form on the right — the panel is what says what GUARDA is to
 * someone who has never seen it, so it carries real numbers rather than a
 * decorative image.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation('guarda')
  const pathname = usePathname()
  const { data: stats } = usePlatformStats()

  const isRegister = pathname.startsWith(publicRoutes.REGISTER)

  useEffect(() => {
    // Only session storage. The blank also cleared the React Query cache here,
    // which raced with this layout's own stats query and wiped it the moment it
    // resolved. Dropping a previous user's cached data belongs to sign-out, not
    // to rendering the sign-in screen.
    sessionStorage.clear()
  }, [])

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col justify-between gap-10 bg-surface-dark px-8 py-10 text-surface-dark-foreground lg:w-[560px] lg:px-16 lg:py-14">
        <Link
          href={publicRoutes.INTRODUCTION}
          className="font-display text-[26px] font-black leading-8 tracking-[-0.01em]"
        >
          GUARDA
        </Link>

        <div className="flex max-w-[400px] flex-col gap-6 lg:my-auto">
          <h2 className="font-display text-[40px] font-black leading-[1.1] tracking-tight lg:text-[54px]">
            {isRegister ? t('AUTH_PANEL_REGISTER_TITLE') : t('AUTH_PANEL_LOGIN_TITLE')}
          </h2>
          <p className="text-base leading-7 text-white/60">
            {isRegister ? t('AUTH_PANEL_REGISTER_BODY') : t('AUTH_PANEL_LOGIN_BODY')}
          </p>
        </div>

        {/*
          Real counts rather than fixed copy: an empty platform should not
          advertise numbers it does not have.
        */}
        {stats ? (
          <StatStrip
            onDark
            className="border-t border-white/10 pt-8"
            items={[
              {
                value: String(stats.instructorCount),
                label: t('AUTH_STAT_INSTRUCTORS'),
              },
              { value: String(stats.trackCount), label: t('AUTH_STAT_TRACKS') },
              { value: String(stats.lessonCount), label: t('AUTH_STAT_LESSONS') },
            ]}
          />
        ) : null}
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-[440px]">{children}</div>
      </main>
    </div>
  )
}
