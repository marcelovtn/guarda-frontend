'use client'

import { useTranslation } from 'react-i18next'

const QUESTIONS = ['1', '2', '3', '4'] as const

export function LandingFaq() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-20 md:px-8 lg:flex-row lg:gap-20 xl:px-16 xl:py-28">
      <div className="flex flex-col gap-4 lg:w-[420px] lg:shrink-0">
        <h2 className="font-display text-[32px] font-black leading-[1.15] tracking-tight text-foreground md:text-[40px]">
          {t('FAQ_TITLE')}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{t('FAQ_BODY')}</p>
      </div>

      <dl className="flex flex-1 flex-col">
        {QUESTIONS.map((question) => (
          <div
            key={question}
            className="flex flex-col gap-2 border-b border-border py-6 first:pt-0"
          >
            <dt className="text-base font-semibold text-foreground">{t(`FAQ_${question}_Q`)}</dt>
            <dd className="text-sm leading-6 text-muted-foreground">{t(`FAQ_${question}_A`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
