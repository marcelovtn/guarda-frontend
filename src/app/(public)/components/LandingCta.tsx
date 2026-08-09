'use client'

import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/utils/routes'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function LandingCta() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section className="relative isolate overflow-hidden bg-surface-dark">
      <Image
        src="/landing/cta.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      {/* The headline sits over a photo, so it gets its own ground rather than
          relying on the image happening to be dark where the text lands. */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/85 to-surface-dark/30" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-24 md:px-8 xl:px-16 xl:py-32">
        <h2 className="max-w-[760px] font-display text-[36px] font-black leading-[1.1] tracking-tight text-white md:text-[54px]">
          {t('CTA_TITLE')}
        </h2>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="h-14 px-7 text-base">
            <Link href={publicRoutes.REGISTER}>{t('CTA_BUTTON')}</Link>
          </Button>
          <p className="text-sm text-white/55">{t('CTA_NOTE')}</p>
        </div>
      </div>
    </section>
  )
}
