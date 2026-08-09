'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetInstructorTracks } from '@/lib/track/track.slice'
import { cn } from '@/lib/utils'
import { formatTotalDuration } from '@/utils/formatLesson'
import { instructorRoutes } from '@/utils/routes'
import { ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { NewTrackDialog } from './components/NewTrackDialog'

export default function InstructorTracksPage() {
  const { t } = useTranslation('guarda')
  const { data: tracks, isLoading } = useGetInstructorTracks()

  const totalLessons = (tracks ?? []).reduce((sum, track) => sum + track.lessonCount, 0)

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-xl font-black tracking-tight text-foreground">
            {t('TRACKS_TITLE')}
          </h1>
          {isLoading ? (
            <Skeleton className="h-5 w-64" />
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('TRACK_COUNT', { count: tracks?.length ?? 0 })} ·{' '}
              {t('LESSON_COUNT', { count: totalLessons })}
            </p>
          )}
        </div>

        <NewTrackDialog
          trigger={
            <Button className="h-11 rounded-full">
              <Plus className="size-4" />
              {t('NAV_NEW_TRACK')}
            </Button>
          }
        />
      </header>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (tracks ?? []).length === 0 ? (
        <EmptyState
          title={t('EMPTY_NO_TRACKS_TITLE')}
          description={t('EMPTY_NO_TRACKS_BODY')}
          action={<NewTrackDialog trigger={<Button>{t('NAV_NEW_TRACK')}</Button>} />}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {(tracks ?? []).map((track, index) => (
            <article
              key={track.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
              <header className="flex items-center justify-between">
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      track.published ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                  />
                  <span className={track.published ? 'text-foreground' : 'text-muted-foreground'}>
                    {track.published ? t('STATUS_PUBLISHED') : t('STATUS_DRAFT')}
                  </span>
                </span>
              </header>

              <div className="flex flex-1 flex-col gap-2">
                <h2 className="font-display text-lg font-bold leading-7 tracking-tight text-foreground">
                  {track.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(`CATEGORY_${track.category}`)} ·{' '}
                  {t('MODULE_COUNT', { count: track.moduleCount })} ·{' '}
                  {t('LESSON_COUNT', { count: track.lessonCount })} ·{' '}
                  {formatTotalDuration(track.totalDurationSec)}
                </p>
              </div>

              <footer className="flex items-center justify-between border-t border-border pt-4">
                {/*
                  Portuguese CLDR treats zero as singular, so a plural key here
                  renders "0 aluno treinando". An empty track gets its own
                  wording instead of a count that reads wrong.
                */}
                <span className="text-xs text-muted-foreground">
                  {!track.published
                    ? t('TRACK_NOT_PUBLISHED')
                    : track.studentCount === 0
                      ? t('TRACK_NO_STUDENTS')
                      : t('TRACK_STUDENTS_TRAINING', { count: track.studentCount })}
                </span>

                <Link
                  href={instructorRoutes.TRACK(track.id)}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t('TRACK_EDIT')}
                  <ChevronRight className="size-4" />
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
