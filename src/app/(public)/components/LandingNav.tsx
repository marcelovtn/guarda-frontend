'use client'

import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const SECTIONS = [
  { key: 'NAV_EXPLORE', href: '#explorar' },
  { key: 'NAV_HOW', href: '#como-funciona' },
  { key: 'NAV_FOR_INSTRUCTORS', href: '#professores' },
] as const

/**
 * Navigation over the dark hero.
 *
 * Anchors rather than routes: the landing answers everything on one page, and
 * sending someone to a separate "how it works" route would break the reading
 * order the page was written in.
 */
export function LandingNav() {
  const { t } = useTranslation('landingGuarda')

  return (
    <nav className="flex w-full items-center justify-between gap-6 py-7">
      <div className="flex items-center gap-11">
        <Link
          href={publicRoutes.INTRODUCTION}
          className="font-display text-[22px] font-black leading-7 tracking-[-0.01em] text-white"
        >
          GUARDA
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-sm font-medium text-white/55 transition-colors hover:text-white"
            >
              {t(section.key)}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          className="text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Link href={publicRoutes.LOGIN}>{t('NAV_SIGN_IN')}</Link>
        </Button>

        <Button asChild>
          <Link href={publicRoutes.REGISTER}>{t('NAV_SIGN_UP')}</Link>
        </Button>
      </div>
    </nav>
  )
}
