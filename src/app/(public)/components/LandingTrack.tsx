'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * A static mock of a real track, so the reader sees the product rather than a
 * description of it. Hardcoded on purpose — the landing must render before
 * anyone has an account, and it is illustrating the shape, not showing live
 * data.
 */
const MODULE_1 = [
  { position: '01', title: 'Por que a sua passagem falha', duration: '8:12', badge: 'free' },
  { position: '02', title: 'A pegada no colarinho e no joelho', duration: '12:44' },
  { position: '03', title: 'Postura: onde colocar o peso', duration: '15:30', badge: 'watching' },
  { position: '04', title: 'Neutralizando o gancho da meia-guarda', duration: '11:02' },
] as const

const MODULE_2 = [
  { position: '05', title: 'Toreando: o passo lateral', duration: '16:20' },
  { position: '06', title: 'Knee cut: entrada e travamento', duration: '19:45' },
] as const

const BULLETS = ['1', '2', '3'] as const

export function LandingTrack() {
  const { t } = useTranslation('landingGuarda')

  return (
    <section className="bg-background-darker">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-20 md:px-8 lg:flex-row lg:gap-20 xl:px-16 xl:py-28">
        <div className="flex flex-col gap-6 lg:w-[480px] lg:shrink-0">
          <p className="text-xs font-semibold tracking-caps text-muted-foreground">
            {t('TRACK_EYEBROW')}
          </p>

          <h2 className="font-display text-[32px] font-black leading-[1.15] tracking-tight text-foreground md:text-[44px]">
            {t('TRACK_TITLE')}
          </h2>

          <p className="text-base leading-7 text-muted-foreground">{t('TRACK_BODY')}</p>

          <ul className="flex flex-col gap-4 pt-2">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                <span className="text-sm leading-6 text-foreground">
                  {t(`TRACK_BULLET_${bullet}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
          <header className="flex flex-col gap-3 border-b border-border p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-semibold tracking-caps text-muted-foreground">
                {t('TRACK_CARD_EYEBROW')}
              </span>
              <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-caps text-accent-foreground">
                {t('TRACK_CARD_LEVEL')}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold leading-7 tracking-tight text-foreground md:text-[26px]">
              {t('TRACK_CARD_TITLE')}
            </h3>

            <p className="text-xs text-muted-foreground">{t('TRACK_CARD_META')}</p>
          </header>

          <TrackModule label={t('TRACK_CARD_MODULE_1')} count="4 aulas" lessons={MODULE_1} />
          <TrackModule label={t('TRACK_CARD_MODULE_2')} count="5 aulas" lessons={MODULE_2} />

          <p className="px-6 py-5 text-sm text-muted-foreground md:px-7">{t('TRACK_CARD_MORE')}</p>
        </div>
      </div>
    </section>
  )
}

function TrackModule({
  label,
  count,
  lessons,
}: {
  label: string
  count: string
  lessons: readonly { position: string; title: string; duration: string; badge?: string }[]
}) {
  const { t } = useTranslation('landingGuarda')

  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between gap-4 bg-background px-6 py-3 md:px-7">
        <span className="text-[11px] font-semibold tracking-caps text-muted-foreground">
          {label}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">{count}</span>
      </div>

      {lessons.map((lesson) => (
        <div
          key={lesson.position}
          className={cn(
            'flex items-center gap-4 px-6 py-3.5 md:px-7',
            lesson.badge === 'watching' && 'bg-accent',
          )}
        >
          <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
            {lesson.position}
          </span>

          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {lesson.title}
          </span>

          {lesson.badge ? (
            <span
              className={cn(
                'hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-caps sm:block',
                lesson.badge === 'free'
                  ? 'bg-secondary text-muted-foreground'
                  : 'bg-primary text-primary-foreground',
              )}
            >
              {lesson.badge === 'free' ? t('TRACK_CARD_FREE') : t('TRACK_CARD_WATCHING')}
            </span>
          ) : null}

          <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {lesson.duration}
          </span>
        </div>
      ))}
    </div>
  )
}
