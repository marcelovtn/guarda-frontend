'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDeleteLessons, useGetInstructorLessons } from '@/lib/lesson/lesson.slice'
import { useGetInstructorTracks } from '@/lib/track/track.slice'
import { instructorRoutes } from '@/utils/routes'
import { Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LessonRow } from './components/LessonRow'

const ALL_TRACKS = 'all'

export default function InstructorLessonsPage() {
  const { t } = useTranslation('guarda')
  const { data: lessons, isLoading } = useGetInstructorLessons()
  const { data: tracks } = useGetInstructorTracks()

  const { mutateAsync: deleteLessons, isPending: isDeleting } = useDeleteLessons()

  const [search, setSearch] = useState('')
  const [trackFilter, setTrackFilter] = useState(ALL_TRACKS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isConfirmingBulkDelete, setIsConfirmingBulkDelete] = useState(false)

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

  /*
    Selection follows what is on screen. A lesson that a search or a track
    filter hides drops out of the count, so the delete button can never act on
    a row the instructor is not looking at.
  */
  const selectedVisibleIds = useMemo(
    () => visible.filter((lesson) => selectedIds.includes(lesson.id)).map((lesson) => lesson.id),
    [visible, selectedIds],
  )

  const areAllVisibleSelected = visible.length > 0 && selectedVisibleIds.length === visible.length

  function toggleLesson(id: string, isSelected: boolean) {
    setSelectedIds((previous) =>
      isSelected ? [...previous, id] : previous.filter((selected) => selected !== id),
    )
  }

  function toggleAllVisible(isSelected: boolean) {
    const visibleIds = visible.map((lesson) => lesson.id)

    setSelectedIds((previous) =>
      isSelected
        ? Array.from(new Set([...previous, ...visibleIds]))
        : previous.filter((id) => !visibleIds.includes(id)),
    )
  }

  async function handleBulkDelete() {
    const { deleted, failed } = await deleteLessons(selectedVisibleIds)

    setSelectedIds([])

    if (deleted > 0) toast.success(t('LIBRARY_DELETED_COUNT', { count: deleted }))
    // Each lesson is its own request, so some can go through while others fail.
    if (failed > 0) toast.error(t('LIBRARY_DELETE_FAILED_COUNT', { count: failed }))
  }

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
        <div className="flex flex-col gap-4">
          {/*
            The bar carries the select-all box instead of the table header: the
            header is desktop-only, and selecting on a phone is where deleting a
            batch of uploads actually happens.
          */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all-lessons"
                checked={areAllVisibleSelected}
                onCheckedChange={(checked) => toggleAllVisible(checked === true)}
              />
              <label
                htmlFor="select-all-lessons"
                className="cursor-pointer text-sm font-medium text-foreground"
              >
                {selectedVisibleIds.length > 0
                  ? t('LIBRARY_SELECTED_COUNT', { count: selectedVisibleIds.length })
                  : t('LIBRARY_SELECT_ALL')}
              </label>
            </div>

            {selectedVisibleIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelectedIds([])} disabled={isDeleting}>
                  {t('LIBRARY_SELECTION_CLEAR')}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setIsConfirmingBulkDelete(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  {isDeleting
                    ? t('LIBRARY_DELETING')
                    : t('LIBRARY_DELETE_SELECTED', { count: selectedVisibleIds.length })}
                </Button>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="hidden grid-cols-[28px_80px_1fr_120px_80px_100px_44px] gap-4 border-b border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-caps text-muted-foreground md:grid">
              <span />
              <span />
              <span>{t('LIBRARY_COL_LESSON')}</span>
              <span>{t('LIBRARY_COL_STATUS')}</span>
              <span className="text-right">{t('LIBRARY_COL_DURATION')}</span>
              <span className="text-right">{t('LIBRARY_COL_VIEWERS')}</span>
            </div>

            {visible.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                isSelected={selectedIds.includes(lesson.id)}
                onSelectedChange={(isSelected) => toggleLesson(lesson.id, isSelected)}
              />
            ))}
          </div>

          <AlertDialog open={isConfirmingBulkDelete} onOpenChange={setIsConfirmingBulkDelete}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('LIBRARY_DELETE_SELECTED_TITLE', { count: selectedVisibleIds.length })}
                </AlertDialogTitle>
                <AlertDialogDescription>{t('LIBRARY_DELETE_SELECTED_BODY')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('EDIT_LESSON_DELETE_CANCEL')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete}>
                  {t('LIBRARY_DELETE_SELECTED', { count: selectedVisibleIds.length })}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </PageContainer>
  )
}
