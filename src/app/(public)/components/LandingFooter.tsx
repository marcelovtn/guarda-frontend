'use client'

import { publicRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const COLUMNS = [
  {
    heading: 'FOOTER_STUDENT',
    links: ['FOOTER_STUDENT_1', 'FOOTER_STUDENT_2', 'FOOTER_STUDENT_3'],
  },
  {
    heading: 'FOOTER_INSTRUCTOR',
    links: ['FOOTER_INSTRUCTOR_1', 'FOOTER_INSTRUCTOR_2', 'FOOTER_INSTRUCTOR_3'],
  },
  {
    heading: 'FOOTER_CONTACT',
    links: ['FOOTER_CONTACT_1', 'FOOTER_CONTACT_2', 'FOOTER_CONTACT_3'],
  },
] as const

export function LandingFooter() {
  const { t } = useTranslation('landingGuarda')

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-14 md:px-8 xl:px-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
          <div className="flex max-w-[340px] flex-col gap-3">
            <Link
              href={publicRoutes.INTRODUCTION}
              className="font-display text-[22px] font-black leading-7 tracking-[-0.01em]"
            >
              GUARDA
            </Link>
            <p className="text-sm leading-6 text-white/45">{t('FOOTER_TAGLINE')}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-16">
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold tracking-caps text-white/35">
                  {t(column.heading)}
                </p>
                {column.links.map((link) => (
                  <span key={link} className="text-sm text-white/70">
                    {t(link)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">{t('FOOTER_LEGAL')}</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/45">{t('FOOTER_TERMS')}</span>
            <span className="text-xs text-white/45">{t('FOOTER_PRIVACY')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
