'use client'

import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

/** The pitch to the person who records, and what they take home. */
export function LandingInstructors() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section id="professores" className="bg-surface-dark text-surface-dark-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-5 py-20 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-20 xl:px-16 xl:py-28">
        <div className="flex flex-col gap-6 lg:max-w-[640px]">
          <p className="text-xs font-semibold tracking-caps text-white/45">
            {t('INSTRUCTORS_EYEBROW')}
          </p>

          <h2 className="font-display text-[32px] font-black leading-[1.1] tracking-tight md:text-[46px]">
            {t('INSTRUCTORS_TITLE')}
          </h2>

          <p className="max-w-[520px] text-base leading-7 text-white/55">{t('INSTRUCTORS_BODY')}</p>

          <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-14 rounded-full px-7 text-base">
              <Link href={publicRoutes.REGISTER}>{t('INSTRUCTORS_CTA')}</Link>
            </Button>
            <p className="max-w-[240px] text-sm leading-5 text-white/45">
              {t('INSTRUCTORS_CTA_NOTE')}
            </p>
          </div>
        </div>

        {/*
          A worked example rather than a percentage alone: "80%" means nothing
          to someone who has not done the arithmetic on their own gym.
        */}
        <div className="flex w-full flex-col gap-6 rounded-lg bg-white/[0.04] p-7 lg:w-[592px] lg:shrink-0 lg:p-9">
          <p className="text-[11px] font-semibold tracking-caps text-white/45">
            {t('INSTRUCTORS_SPLIT_EYEBROW')}
          </p>

          <div className="flex items-end gap-4">
            <span className="font-display text-[64px] font-black leading-none tracking-tight md:text-[76px]">
              {t('INSTRUCTORS_SPLIT_VALUE')}
            </span>
            <p className="max-w-[220px] pb-2 text-sm leading-5 text-white/55">
              {t('INSTRUCTORS_SPLIT_BODY')}
            </p>
          </div>

          <div className="h-px w-full bg-white/10" />

          <dl className="flex flex-col gap-3">
            <SplitRow
              label={t('INSTRUCTORS_SPLIT_ROW_1')}
              value={t('INSTRUCTORS_SPLIT_ROW_1_VALUE')}
            />
            <SplitRow
              label={t('INSTRUCTORS_SPLIT_ROW_2')}
              value={t('INSTRUCTORS_SPLIT_ROW_2_VALUE')}
            />
            <SplitRow
              label={t('INSTRUCTORS_SPLIT_TOTAL')}
              value={t('INSTRUCTORS_SPLIT_TOTAL_VALUE')}
              emphasis
            />
          </dl>
        </div>
      </div>
    </section>
  )
}

function SplitRow({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={emphasis ? 'text-sm font-semibold text-white' : 'text-sm text-white/55'}>
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? 'font-display text-lg font-bold tabular-nums tracking-tight text-white'
            : 'text-sm tabular-nums text-white/70'
        }
      >
        {value}
      </dd>
    </div>
  )
}
