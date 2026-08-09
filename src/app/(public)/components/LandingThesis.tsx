'use client'

import { useTranslation } from 'react-i18next'

const STEPS = ['1', '2', '3'] as const

/** The argument the whole product rests on: order is the product. */
export function LandingThesis() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section
      id="como-funciona"
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-5 py-20 md:px-8 xl:px-16 xl:py-28"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
        <h2 className="max-w-[820px] font-display text-[32px] font-black leading-[1.15] tracking-tight text-foreground md:text-[46px]">
          {t('THESIS_TITLE')}
        </h2>
        <p className="max-w-[400px] text-base leading-7 text-muted-foreground">
          {t('THESIS_BODY')}
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <article key={step} className="flex flex-col gap-3 border-t border-border pt-6">
            <span className="text-xs font-semibold tabular-nums tracking-caps text-muted-foreground">
              {step.padStart(2, '0')}
            </span>
            <h3 className="text-lg font-bold leading-7 tracking-tight text-foreground">
              {t(`THESIS_STEP_${step}_TITLE`)}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {t(`THESIS_STEP_${step}_BODY`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
