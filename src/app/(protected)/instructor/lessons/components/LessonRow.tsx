'use client'

import { VideoThumb } from '@/components/layout/VideoThumb'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteLesson, useUpdateLesson } from '@/lib/lesson/lesson.slice'
import type { InstructorLesson } from '@/lib/lesson/types'
import { cn } from '@/lib/utils'
import { formatDuration } from '@/utils/formatLesson'
import { instructorRoutes } from '@/utils/routes'
import { MoreVertical, Pencil, Trash2, Upload, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

/**
 * One row of the instructor's library.
 *
 * A lesson with no module shows the "sem trilha" warning in place of its
 * position — that state is the point of the screen, not an error to hide.
 *
 * The whole row navigates through a link laid over it rather than wrapping it:
 * the actions menu is a button, and a button inside an anchor both is invalid
 * HTML and would navigate away the moment it is pressed.
 */
export function LessonRow({ lesson }: { lesson: InstructorLesson }) {
  const { t } = useTranslation('guarda')
  const { mutateAsync: updateLesson } = useUpdateLesson(lesson.id)
  const { mutateAsync: deleteLesson } = useDeleteLesson()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const isPublished = lesson.status === 'PUBLISHED'

  async function togglePublished() {
    await updateLesson({ status: isPublished ? 'DRAFT' : 'PUBLISHED' })
    toast.success(isPublished ? t('LIBRARY_UNPUBLISHED') : t('NEW_LESSON_PUBLISHED'))
  }

  async function handleDelete() {
    await deleteLesson(lesson.id)
    toast.success(t('EDIT_LESSON_DELETED'))
  }

  return (
    <div className="relative grid grid-cols-[1fr_44px] items-center gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/40 sm:grid-cols-[80px_1fr_44px] md:grid-cols-[80px_1fr_120px_80px_100px_44px]">
      <Link
        href={instructorRoutes.LESSON(lesson.id)}
        aria-label={lesson.title}
        className="absolute inset-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {/* The thumbnail is the first thing to go on a phone: with it, the
          title had a single word of room. */}
      <VideoThumb className="pointer-events-none hidden w-20 rounded-sm sm:block" />

      <div className="pointer-events-none flex min-w-0 flex-col gap-1">
        <p className="truncate text-base font-semibold text-foreground">{lesson.title}</p>

        {lesson.track ? (
          <p className="truncate text-xs text-muted-foreground">
            {lesson.track.trackTitle} · {t('LIBRARY_MODULE', { number: lesson.track.moduleNumber })}{' '}
            ·{' '}
            {t('POSITION_SHORT', {
              position: String(lesson.track.trackPosition).padStart(2, '0'),
            })}
          </p>
        ) : (
          <p className="truncate text-xs font-medium text-destructive">{t('NO_TRACK_WARNING')}</p>
        )}
      </div>

      <p className="pointer-events-none hidden items-center gap-2 text-sm md:flex">
        <span
          className={cn(
            'size-1.5 rounded-full',
            isPublished ? 'bg-primary' : 'bg-muted-foreground/40',
          )}
        />
        <span className={isPublished ? 'text-foreground' : 'text-muted-foreground'}>
          {isPublished ? t('STATUS_PUBLISHED') : t('STATUS_DRAFT')}
        </span>
      </p>

      <p className="pointer-events-none hidden text-right text-sm tabular-nums text-muted-foreground md:block">
        {formatDuration(lesson.durationSec)}
      </p>

      <p className="pointer-events-none hidden text-right text-sm text-muted-foreground md:block">
        {lesson.viewerCount > 0 ? t('STUDENT_COUNT', { count: lesson.viewerCount }) : '—'}
      </p>

      {/* Sits above the row link, so pressing it opens the menu instead of
          following the row. */}
      <div className="relative z-10 justify-self-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('LIBRARY_ROW_ACTIONS')}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link href={instructorRoutes.LESSON(lesson.id)}>
                <Pencil className="size-4" />
                {t('LIBRARY_EDIT')}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={togglePublished}
              // Publishing needs a video: the backend refuses without one and
              // the row would only surface the error after the click.
              disabled={!isPublished && !lesson.hasVideo}
            >
              {isPublished ? <Upload className="size-4" /> : <UploadCloud className="size-4" />}
              {isPublished ? t('EDIT_LESSON_UNPUBLISH') : t('NEW_LESSON_PUBLISH')}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setIsConfirmingDelete(true)}
            >
              <Trash2 className="size-4" />
              {t('EDIT_LESSON_DELETE')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Outside the menu: a dialog mounted inside it unmounts with the menu
            the moment the item is selected. */}
        <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('EDIT_LESSON_DELETE_TITLE')}</AlertDialogTitle>
              <AlertDialogDescription>{t('EDIT_LESSON_DELETE_BODY')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('EDIT_LESSON_DELETE_CANCEL')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t('EDIT_LESSON_DELETE')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
