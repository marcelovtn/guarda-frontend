'use client'

import { ProgressBar } from '@/components/layout/ProgressBar'
import { VideoThumb } from '@/components/layout/VideoThumb'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export interface VideoUploadState {
  fileName: string
  sizeBytes: number
  /** 0–1 while uploading, 1 once the bytes are in storage. */
  uploadProgress: number
  /** Set once the upload finishes; this is what the lesson stores. */
  key: string | null
  error?: string
}

interface VideoUploadFieldProps {
  video: VideoUploadState | null
  onSelect: (file: File) => void
  disabled?: boolean
}

function formatSize(bytes: number): string {
  const gb = bytes / 1024 ** 3
  if (gb >= 1) return `${gb.toFixed(1).replace('.', ',')} GB`
  return `${Math.round(bytes / 1024 ** 2)} MB`
}

/**
 * Picks the lesson video and shows how far it has got.
 *
 * The rest of the form stays usable while the bytes go up — a lesson recording
 * is over a gigabyte, and blocking the instructor from typing a title for the
 * twenty minutes that takes would be absurd. Only publishing waits.
 */
export function VideoUploadField({ video, onSelect, disabled }: VideoUploadFieldProps) {
  const { t } = useTranslation('guarda')
  const inputRef = useRef<HTMLInputElement>(null)

  const percent = Math.round((video?.uploadProgress ?? 0) * 100)
  const isUploading = Boolean(video) && percent < 100

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 md:flex-row md:items-center md:gap-6 md:p-6">
      <VideoThumb className="w-full shrink-0 md:w-[200px]" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {video ? (
          <>
            <p className="truncate text-base font-semibold text-foreground">{video.fileName}</p>
            <p className="text-sm text-muted-foreground">{formatSize(video.sizeBytes)}</p>

            {video.error ? (
              <p className="text-sm font-medium text-destructive">{video.error}</p>
            ) : isUploading ? (
              <div className="flex flex-col gap-2 pt-1">
                <ProgressBar percent={percent} />
                <p className="text-sm font-medium text-primary">
                  {t('NEW_LESSON_UPLOADING', { percent })}
                </p>
              </div>
            ) : (
              <p className="text-sm font-medium text-primary">{t('NEW_LESSON_UPLOADED')}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-foreground">{t('NEW_LESSON_PICK_TITLE')}</p>
            <p className="text-sm leading-5 text-muted-foreground">{t('NEW_LESSON_PICK_HINT')}</p>
          </>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="shrink-0"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        {video ? t('NEW_LESSON_REPLACE') : t('NEW_LESSON_PICK')}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-matroska,video/webm"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onSelect(file)
          event.target.value = ''
        }}
      />
    </div>
  )
}
