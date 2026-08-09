'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { TrackCard } from '@/components/layout/TrackCard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { TrackCategory } from '@/lib/instructor/types'
import { useGetTracks } from '@/lib/track/track.slice'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CATEGORIES: TrackCategory[] = [
  'GUARD',
  'PASSING',
  'CONTROL',
  'SUBMISSIONS',
  'ESCAPES',
  'TAKEDOWNS',
]

const ALL = 'ALL'

export default function TracksPage() {
  const { t } = useTranslation('guarda')
  const { data: tracks, isLoading } = useGetTracks()
  const [filter, setFilter] = useState<string>(ALL)

  /** Only offer a category the instructor actually has tracks in. */
  const available = useMemo(() => {
    const present = new Set((tracks ?? []).map((track) => track.category))
    return CATEGORIES.filter((category) => present.has(category))
  }, [tracks])

  const visible = useMemo(
    () => (tracks ?? []).filter((track) => filter === ALL || track.category === filter),
    [tracks, filter],
  )

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('NAV_TRACKS')}
        </h1>
        {isLoading ? (
          <Skeleton className="h-5 w-full max-w-48" />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('TRACK_COUNT', { count: tracks?.length ?? 0 })}
          </p>
        )}
      </header>

      <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 md:flex-wrap">
        <FilterChip
          label={t('TRACKS_ALL')}
          active={filter === ALL}
          onClick={() => setFilter(ALL)}
        />
        {available.map((category) => (
          <FilterChip
            key={category}
            label={t(`CATEGORY_${category}`)}
            active={filter === category}
            onClick={() => setFilter(category)}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState title={t('EMPTY_NO_TRACKS_TITLE')} description={t('EMPTY_NO_TRACKS_BODY')} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'border border-border bg-card text-foreground hover:bg-secondary',
      )}
    >
      {label}
    </button>
  )
}
