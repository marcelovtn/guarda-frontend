'use client'

import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { Button } from '@/components/ui/button'
import { useUpload } from '@/lib/storage/storage.slice'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface PhotoUploadFieldProps {
  /** Shown in the preview, and used for the initials fallback. */
  name: string
  photoUrl?: string | null
  /** Receives the storage key to persist on the profile. */
  onUploaded: (key: string, url: string) => void
  onRemove?: () => void
  /** Namespace in the bucket — "avatars" for people. */
  folder?: string
  label?: string
  hint?: string
}

/**
 * Circular photo picker used by both the instructor profile and the student
 * account screen.
 *
 * Uploads straight to storage and hands back the key; persisting it is the
 * caller's job, so the field does not need to know which profile it belongs to.
 */
export function PhotoUploadField({
  name,
  photoUrl,
  onUploaded,
  onRemove,
  folder = 'avatars',
  label,
  hint,
}: PhotoUploadFieldProps) {
  const { t } = useTranslation('guarda')
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: upload, isPending } = useUpload(folder)

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const { key, url } = await upload({ file, kind: 'image' })
    onUploaded(key, url)

    // Clearing lets the same file be picked again after a removal.
    event.target.value = ''
  }

  return (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <InstructorAvatar name={name} src={photoUrl} size="xl" />

      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">{label ?? t('PHOTO_LABEL')}</p>
        <p className="max-w-md text-sm leading-5 text-muted-foreground">
          {hint ?? t('PHOTO_HINT')}
        </p>

        <div className="flex items-center gap-2.5 pt-0.5">
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={isPending}>
            {isPending ? t('PHOTO_UPLOADING') : t('PHOTO_UPLOAD')}
          </Button>

          {photoUrl && onRemove ? (
            <Button type="button" variant="outline" onClick={onRemove} disabled={isPending}>
              {t('PHOTO_REMOVE')}
            </Button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  )
}
