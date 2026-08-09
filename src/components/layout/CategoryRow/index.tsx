'use client'

import { TrackCard, type TrackCardData } from '@/components/layout/TrackCard'
import { studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface CategoryRowProps {
  category: string
  tracks: TrackCardData[]
}

/**
 * One category row on the home page — "Guarda · 3 trilhas · Ver tudo".
 *
 * A grid rather than a horizontal scroller: the artboards show every track in
 * the row at once, and with a catalogue this size nothing is hidden off-screen
 * that would need scrolling to reach.
 */
export function CategoryRow({ category, tracks }: CategoryRowProps) {
  const { t } = useTranslation('guarda')

  if (tracks.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            {t(`CATEGORY_${category}`)}
          </h2>
          <span className="text-xs text-muted-foreground">
            {t('TRACK_COUNT', { count: tracks.length })}
          </span>
        </div>

        <Link
          href={studentRoutes.TRACKS}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          {t('SEE_ALL')}
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tracks.map((track) => (
          <TrackCard key={track.slug} track={track} />
        ))}
      </div>
    </section>
  )
}
