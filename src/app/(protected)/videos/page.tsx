'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { LessonCard } from '@/components/layout/LessonCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { Skeleton } from '@/components/ui/skeleton'
import type { TrackCategory } from '@/lib/instructor/types'
import { useGetLessons } from '@/lib/lesson/lesson.slice'
import { cn } from '@/lib/utils'
import { useState } from 'react'
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
/** Lessons the instructor published without slotting into a track. */
const ORPHANS = 'ORPHANS'

export default function VideosPage() {
  const { t } = useTranslation('guarda')
  const [filter, setFilter] = useState<string>(ALL)

  const {
    data: lessons,
    isLoading,
    isFetching,
  } = useGetLessons({
    category: filter !== ALL && filter !== ORPHANS ? filter : undefined,
    orphansOnly: filter === ORPHANS,
  })

  const visible = lessons ?? []

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('NAV_VIDEOS')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('VIDEOS_SUBTITLE')}</p>
      </header>

      <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 md:flex-wrap">
        <FilterChip
          label={t('TRACKS_ALL')}
          active={filter === ALL}
          onClick={() => setFilter(ALL)}
        />
        {CATEGORIES.map((category) => (
          <FilterChip
            key={category}
            label={t(`CATEGORY_${category}`)}
            active={filter === category}
            onClick={() => setFilter(category)}
          />
        ))}
        <FilterChip
          label={t('CATEGORY_NONE')}
          active={filter === ORPHANS}
          dashed
          onClick={() => setFilter(ORPHANS)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState title={t('EMPTY_NO_LESSONS_TITLE')} description={t('EMPTY_NO_LESSONS_BODY')} />
      ) : (
        // Dimmed while a new filter loads. keepPreviousData holds the previous
        // grid in place, so switching filters reads as a transition rather than
        // the page emptying and rebuilding.
        <div
          className={cn(
            'grid gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            isFetching && 'opacity-60',
          )}
        >
          {visible.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={{
                id: lesson.id,
                title: lesson.title,
                durationSec: lesson.durationSec,
                publishedAt: lesson.publishedAt,
                track: lesson.track
                  ? { trackTitle: lesson.track.trackTitle, category: lesson.track.category }
                  : null,
              }}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

function FilterChip({
  label,
  active,
  dashed = false,
  onClick,
}: {
  label: string
  active: boolean
  dashed?: boolean
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
          : cn(
              'bg-card text-foreground hover:bg-secondary',
              // Dashed marks the odd one out: not a category, an absence of one.
              dashed ? 'border border-dashed border-border' : 'border border-border',
            ),
      )}
    >
      {label}
    </button>
  )
}
