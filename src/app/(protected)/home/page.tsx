'use client'

import { CategoryRow } from '@/components/layout/CategoryRow'
import { EmptyState } from '@/components/layout/EmptyState'
import { LessonCard } from '@/components/layout/LessonCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLessons } from '@/lib/lesson/lesson.slice'
import { useGetContinueWatching } from '@/lib/progress/progress.slice'
import { useGetSubscriptions } from '@/lib/subscription/subscription.slice'
import { useGetRecommendedTrack, useGetTracks } from '@/lib/track/track.slice'
import type { TrackCategory } from '@/lib/instructor/types'
import { Button } from '@/components/ui/button'
import { studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HomeHero } from './components/HomeHero'

/** Row order on the home page, matching the artboard. */
const CATEGORY_ORDER: TrackCategory[] = [
  'GUARD',
  'PASSING',
  'CONTROL',
  'SUBMISSIONS',
  'ESCAPES',
  'TAKEDOWNS',
]

/** How many recent lessons the "Novo do professor" row shows. */
const RECENT_COUNT = 3

export default function HomePage() {
  const { t } = useTranslation('guarda')

  const { data: tracks, isLoading: isLoadingTracks } = useGetTracks()
  const { data: continueWatching, isLoading: isLoadingProgress } = useGetContinueWatching()
  const { data: recommended } = useGetRecommendedTrack()
  const { data: lessons } = useGetLessons()
  const { data: subscriptions } = useGetSubscriptions()

  const recent = useMemo(() => (lessons ?? []).slice(0, RECENT_COUNT), [lessons])

  const byCategory = useMemo(() => {
    const grouped = new Map<TrackCategory, typeof tracks>()

    for (const track of tracks ?? []) {
      const current = grouped.get(track.category) ?? []
      grouped.set(track.category, [...current, track])
    }

    return CATEGORY_ORDER.map((category) => ({
      category,
      tracks: grouped.get(category) ?? [],
    })).filter((row) => row.tracks.length > 0)
  }, [tracks])

  if (isLoadingTracks || isLoadingProgress) {
    return (
      <PageContainer className="flex flex-col gap-10">
        <Skeleton className="h-[405px] w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </PageContainer>
    )
  }

  /*
   * Sem trilha tem duas causas, e elas pedem respostas diferentes.
   *
   * Quem não assinou não vê nada porque o gate de acesso funcionou, e precisa
   * de um caminho para assinar — antes, a home dizia "nenhuma trilha ainda" e
   * não oferecia nada, então quem entrava pelo login em vez do cadastro ficava
   * preso: nenhuma outra tela do app leva ao fluxo de assinatura.
   *
   * Quem já assinou e não vê trilha está esperando o professor publicar, o que
   * é outra conversa.
   */
  if ((tracks ?? []).length === 0 && (subscriptions ?? []).length === 0) {
    return (
      <PageContainer>
        <EmptyState
          title={t('EMPTY_NO_SUBSCRIPTION_TITLE')}
          description={t('EMPTY_NO_SUBSCRIPTION_BODY')}
          action={
            <Button asChild>
              <Link href={studentRoutes.SUBSCRIBE_PLANS}>{t('EMPTY_NO_SUBSCRIPTION_CTA')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  if ((tracks ?? []).length === 0) {
    return (
      <PageContainer>
        <EmptyState title={t('EMPTY_NO_TRACKS_TITLE')} description={t('EMPTY_NO_TRACKS_BODY')} />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-16">
      <HomeHero continueWatching={continueWatching ?? null} recommended={recommended ?? null} />

      {recent.length > 0 ? (
        <section className="flex flex-col gap-5">
          <header className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              {t('HOME_NEW_FROM_INSTRUCTOR')}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t('HOME_NEW_COUNT', { count: recent.length })}
            </span>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((lesson) => (
              <LessonCard
                key={lesson.id}
                eyebrow
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
        </section>
      ) : null}

      {byCategory.map((row) => (
        <CategoryRow
          key={row.category}
          category={row.category}
          tracks={(row.tracks ?? []).map((track) => ({
            slug: track.slug,
            title: track.title,
            level: track.level,
            lessonCount: track.lessonCount,
            totalDurationSec: track.totalDurationSec,
            progress: track.progress,
          }))}
        />
      ))}
    </PageContainer>
  )
}
