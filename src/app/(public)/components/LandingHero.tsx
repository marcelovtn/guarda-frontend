'use client'

import { Button } from '@/components/ui/button'
import { usePlatformStats } from '@/lib/platform/platform.slice'
import { publicRoutes } from '@/utils/routes'
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { LandingNav } from './LandingNav'

/** Placeholder faces on the proof row, until real instructors have photos. */
const PROOF_INITIALS = ['RM', 'JC', 'TA', 'LP']

export function LandingHero() {
  const { t } = useTranslation('landingGuarda')
  const { data: stats } = usePlatformStats()

  return (
    <section className="bg-surface-dark text-surface-dark-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-16">
        <LandingNav />

        <div className="flex flex-col gap-6 pb-14 pt-10 lg:flex-row lg:items-end lg:gap-20">
          <div className="flex flex-1 flex-col gap-6">
            <p className="text-xs font-semibold tracking-caps text-white/45">{t('HERO_EYEBROW')}</p>
            <h1 className="max-w-[820px] font-display text-[44px] font-black leading-[1.05] tracking-tight md:text-[64px] xl:text-[76px]">
              {t('HERO_TITLE')}
            </h1>
          </div>

          <p className="max-w-[400px] text-base leading-7 text-white/55">{t('HERO_BODY')}</p>
        </div>

        <div className="flex flex-col items-start gap-4 pb-14 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="h-14 rounded-full px-7 text-base">
            <Link href={publicRoutes.REGISTER}>{t('HERO_CTA_PRIMARY')}</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-white/20 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={publicRoutes.REGISTER}>{t('HERO_CTA_SECONDARY')}</Link>
          </Button>

          <p className="text-sm text-white/45 sm:ml-3">{t('HERO_CTA_NOTE')}</p>
        </div>

        <figure className="relative aspect-[1312/600] w-full overflow-hidden rounded-lg">
          <Image
            src="/landing/hero.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1312px"
            className="object-cover"
          />
          {/* Keeps the caption legible over whatever part of the photo it lands on. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <figcaption className="absolute inset-x-5 bottom-5 flex items-center gap-4 md:inset-x-8 md:bottom-8">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/95 md:size-14">
              <Play className="ml-0.5 size-5 fill-surface-dark text-surface-dark" />
            </span>

            <span className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-[11px] font-semibold tracking-caps text-white/55">
                {t('HERO_STILL_EYEBROW')}
              </span>
              <span className="truncate font-display text-lg font-bold tracking-tight text-white md:text-[26px]">
                {t('HERO_STILL_TITLE')}
              </span>
            </span>

            <span className="ml-auto hidden shrink-0 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tabular-nums text-white/85 sm:block">
              {t('HERO_STILL_DURATION')}
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-8 border-t border-white/10 py-9 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {PROOF_INITIALS.map((initials) => (
                <span
                  key={initials}
                  className="flex size-9 items-center justify-center rounded-full bg-[#2C2A26] text-[11px] font-semibold text-white/85 ring-2 ring-surface-dark"
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/55">{t('HERO_PROOF')}</p>
          </div>

          {/*
            Lesson and track counts come from the API — the landing should not
            claim a catalogue the platform does not have. The price is fixed
            copy because it is the offer, not a measurement.
          */}
          <dl className="flex flex-wrap items-start gap-x-12 gap-y-5">
            <Stat value={stats?.lessonCount} label={t('HERO_STAT_LESSONS')} />
            <Stat value={stats?.trackCount} label={t('HERO_STAT_TRACKS')} />
            <Stat value={t('HERO_STAT_PRICE_VALUE')} label={t('HERO_STAT_PRICE_LABEL')} />
          </dl>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string | number | undefined; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-[26px] font-bold leading-8 tracking-tight text-white">
        {value ?? '—'}
      </dd>
      <p className="text-xs text-white/45">{label}</p>
    </div>
  )
}
