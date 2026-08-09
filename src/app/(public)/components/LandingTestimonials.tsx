'use client'

import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { useTranslation } from 'react-i18next'

export function LandingTestimonials() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-20 md:px-8 lg:flex-row lg:gap-20 xl:px-16 xl:py-24">
      <figure className="flex flex-1 flex-col gap-8">
        <blockquote className="font-display text-[26px] font-semibold leading-[1.35] tracking-tight text-foreground md:text-[34px]">
          {t('TESTIMONIAL_MAIN')}
        </blockquote>

        <figcaption className="flex items-center gap-3">
          <InstructorAvatar name={t('TESTIMONIAL_MAIN_NAME')} size="sm" />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {t('TESTIMONIAL_MAIN_NAME')}
            </span>
            <span className="text-xs text-muted-foreground">{t('TESTIMONIAL_MAIN_ROLE')}</span>
          </span>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-10 lg:w-[496px] lg:shrink-0">
        {(['2', '3'] as const).map((key) => (
          <figure key={key} className="flex flex-col gap-4 border-t border-border pt-6">
            <blockquote className="text-base leading-7 text-foreground">
              {t(`TESTIMONIAL_${key}`)}
            </blockquote>
            <figcaption className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {t(`TESTIMONIAL_${key}_NAME`)}
              </span>
              <span className="text-xs text-muted-foreground">{t(`TESTIMONIAL_${key}_ROLE`)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
