'use client'

import { useTranslation } from 'react-i18next'

const FEATURES = ['1', '2', '3', '4'] as const

export function LandingPricing() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section className="bg-background-darker">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 px-5 py-20 text-center md:px-8 xl:px-16 xl:py-28">
        <div className="flex max-w-[700px] flex-col items-center gap-5">
          <p className="text-xs font-semibold tracking-caps text-muted-foreground">
            {t('PRICE_EYEBROW')}
          </p>

          <p className="flex items-baseline gap-2">
            <span className="font-display text-[56px] font-black leading-none tracking-tight text-foreground md:text-[72px]">
              {t('PRICE_VALUE')}
            </span>
            <span className="text-base text-muted-foreground">{t('PRICE_PERIOD')}</span>
          </p>

          <p className="text-base leading-7 text-muted-foreground">{t('PRICE_BODY')}</p>
        </div>

        <div className="grid w-full gap-8 text-left sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex flex-col gap-2 border-t border-border pt-5">
              <h3 className="text-base font-semibold text-foreground">
                {t(`PRICE_FEATURE_${feature}_TITLE`)}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {t(`PRICE_FEATURE_${feature}_BODY`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
