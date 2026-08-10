'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetInstructorLessons } from '@/lib/lesson/lesson.slice'
import { useGetInstructorTracks } from '@/lib/track/track.slice'
import { instructorRoutes } from '@/utils/routes'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonRow } from './components/LessonRow'

const ALL_TRACKS = 'all'

export default function InstructorLessonsPage() {
  const { t } = useTranslation('guarda')
  const { data: lessons, isLoading } = useGetInstructorLessons()
  const { data: tracks } = useGetInstructorTracks()

  const [search, setSearch] = useState('')
  const [trackFilter, setTrackFilter] = useState(ALL_TRACKS)

  const counts = useMemo(() => {
    const all = lessons ?? []
    return {
      published: all.filter((lesson) => lesson.status === 'PUBLISHED').length,
      drafts: all.filter((lesson) => lesson.status === 'DRAFT').length,
      orphans: all.filter((lesson) => !lesson.track).length,
    }
  }, [lessons])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    return (lessons ?? []).filter((lesson) => {
      const matchesSearch = !term || lesson.title.toLowerCase().includes(term)
      const matchesTrack = trackFilter === ALL_TRACKS || lesson.track?.trackId === trackFilter
      return matchesSearch && matchesTrack
    })
  }, [lessons, search, trackFilter])

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-xl font-black tracking-tight text-foreground">
            {t('LIBRARY_TITLE')}
          </h1>

          {isLoading ? (
            <Skeleton className="h-5 w-full max-w-72" />
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('LIBRARY_SUMMARY', {
                published: counts.published,
                drafts: counts.drafts,
                orphans: counts.orphans,
              })}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('LIBRARY_SEARCH')}
              className="h-11 w-full rounded-full pl-10 sm:w-[260px]"
            />
          </div>

          <Select value={trackFilter} onValueChange={setTrackFilter}>
            <SelectTrigger className="h-11 w-full rounded-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TRACKS}>{t('LIBRARY_ALL_TRACKS')}</SelectItem>
              {(tracks ?? []).map((track) => (
                <SelectItem key={track.id} value={track.id}>
                  {track.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild className="h-11 rounded-full">
            <Link href={instructorRoutes.NEW_LESSON}>
              <Plus className="size-4" />
              {t('NAV_NEW_LESSON')}
            </Link>
          </Button>
        </div>
      </header>

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-lg" />
      ) : visible.length === 0 ? (
        <EmptyState
          title={t('EMPTY_NO_LESSONS_TITLE')}
          description={t('EMPTY_NO_LESSONS_BODY')}
          action={
            <Button asChild>
              <Link href={instructorRoutes.NEW_LESSON}>{t('NAV_NEW_LESSON')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="hidden grid-cols-[80px_1fr_120px_80px_100px_44px] gap-4 border-b border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-caps text-muted-foreground md:grid">
            <span />
            <span>{t('LIBRARY_COL_LESSON')}</span>
            <span>{t('LIBRARY_COL_STATUS')}</span>
            <span className="text-right">{t('LIBRARY_COL_DURATION')}</span>
            <span className="text-right">{t('LIBRARY_COL_VIEWERS')}</span>
          </div>

          {visible.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
