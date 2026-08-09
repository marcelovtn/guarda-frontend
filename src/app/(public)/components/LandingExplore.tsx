'use client'

import { cn } from '@/lib/utils'
import { publicRoutes } from '@/utils/routes'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const CATEGORIES = ['GUARD', 'PASSING', 'CONTROL', 'SUBMISSIONS', 'ESCAPES', 'TAKEDOWNS'] as const

/** Sample catalogue. Illustrative — the real grid lives behind sign-in. */
const TRACKS = [
  {
    image: '/landing/track-1.webp',
    lessons: '24 AULAS',
    title: 'Fundamentos da Guarda Fechada',
    meta: 'Rafael Moura · 5h 05min · iniciante',
  },
  {
    image: '/landing/track-2.webp',
    lessons: '18 AULAS',
    title: 'Raspagens da Meia-Guarda',
    meta: 'Júlia Camargo · 2h 40min · intermediário',
  },
  {
    image: '/landing/track-3.webp',
    lessons: '12 AULAS',
    title: 'Finalizações do Cem Quilos',
    meta: 'Tiago Alencar · 2h 15min · avançado',
  },
  {
    image: '/landing/track-4.webp',
    lessons: '19 AULAS',
    title: 'Quedas para o Jiu Jitsu',
    meta: 'Lucas Prado · 4h 40min · iniciante',
  },
] as const

export function LandingExplore() {
  const { t } = useTranslation(['landingGuarda', 'guarda'])

  return (
    <section
      id="explorar"
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-20 md:px-8 xl:px-16 xl:py-28"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-[700px] font-display text-[32px] font-black leading-[1.15] tracking-tight text-foreground md:text-[44px]">
          {t('EXPLORE_TITLE')}
        </h2>

        <Link
          href={publicRoutes.REGISTER}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          {t('EXPLORE_LINK')}
        </Link>
      </div>

      {/* Scrolls horizontally on narrow screens rather than wrapping into a
          ragged block of pills. */}
      <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 md:flex-wrap">
        <Chip label={t('EXPLORE_ALL')} active />
        {CATEGORIES.map((category) => (
          <Chip key={category} label={t(`guarda:CATEGORY_${category}`)} />
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TRACKS.map((track) => (
          <article key={track.title} className="flex flex-col gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-surface-dark">
              <Image
                src={track.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 310px"
                className="object-cover"
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold tracking-caps text-white/85">
                {track.lessons}
              </span>
            </div>

            <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-foreground">
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground">{track.meta}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-4 py-2 text-sm font-medium',
        active ? 'bg-foreground text-background' : 'border border-border bg-card text-foreground',
      )}
    >
      {label}
    </span>
  )
}
