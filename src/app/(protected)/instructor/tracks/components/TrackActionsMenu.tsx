'use client'

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
import { useDeleteTrack } from '@/lib/track/track.slice'
import { instructorRoutes } from '@/utils/routes'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

/**
 * The ⋯ menu of a track, on the list and on the builder.
 *
 * Deleting always goes through the confirmation: a track carries its modules
 * and the order of every lesson in it, and none of that comes back from an
 * accidental click. The lessons themselves survive as "aulas sem trilha", which
 * is what the dialog says so the instructor is not left guessing.
 */
export function TrackActionsMenu({
  trackId,
  onDeleted,
}: {
  trackId: string
  /** Where to go once the track is gone — the builder cannot stay on screen. */
  onDeleted?: () => void
}) {
  const { t } = useTranslation('guarda')
  const { mutateAsync: deleteTrack, isPending: isDeleting } = useDeleteTrack()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  async function handleDelete() {
    await deleteTrack(trackId)
    toast.success(t('TRACK_DELETED'))
    onDeleted?.()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t('TRACK_ROW_ACTIONS')}>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem asChild>
            <Link href={instructorRoutes.TRACK(trackId)}>
              <Pencil className="size-4" />
              {t('TRACK_MENU_EDIT')}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setIsConfirmingDelete(true)}
          >
            <Trash2 className="size-4" />
            {t('TRACK_DELETE')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Outside the menu: a dialog mounted inside it unmounts with the menu
          the moment the item is selected. */}
      <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('TRACK_DELETE_TITLE')}</AlertDialogTitle>
            <AlertDialogDescription>{t('TRACK_DELETE_BODY')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('EDIT_LESSON_DELETE_CANCEL')}
            </AlertDialogCancel>
            {/*
              The dialog closes on click, so a pending delete has nowhere to
              show itself other than the label of the button that is leaving.
            */}
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t('TRACK_DELETING') : t('TRACK_DELETE')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
