'use client'

import { VideoThumb } from '@/components/layout/VideoThumb'
import { useSavePosition } from '@/lib/progress/progress.slice'
import { useEffect, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useTranslation } from 'react-i18next'

interface LessonPlayerProps {
  lessonId: string
  videoUrl: string | null
  /** Where to resume from, in seconds. */
  startAtSec: number
  onEnded: () => void
}

/** How often a position is written while the video plays. */
const SAVE_DEBOUNCE_MS = 4000

/**
 * The video element and the progress it reports.
 *
 * Position is written on a debounce rather than on every timeupdate — the
 * event fires roughly four times a second and would put the API under constant
 * load for no gain.
 */
export function LessonPlayer({ lessonId, videoUrl, startAtSec, onEnded }: LessonPlayerProps) {
  const { t } = useTranslation('guarda')
  const videoRef = useRef<HTMLVideoElement>(null)
  const { mutate: savePosition } = useSavePosition()

  const persist = useDebouncedCallback((lastPositionSec: number) => {
    savePosition({ lessonId, lastPositionSec })
  }, SAVE_DEBOUNCE_MS)

  // Resume where the student stopped. Runs once per lesson, after metadata is
  // available — seeking before that is ignored by the browser.
  useEffect(() => {
    const video = videoRef.current
    if (!video || startAtSec <= 0) return

    const seek = () => {
      video.currentTime = startAtSec
    }

    if (video.readyState >= 1) seek()
    else video.addEventListener('loadedmetadata', seek, { once: true })
  }, [lessonId, startAtSec])

  // Write the last position when leaving, so closing the tab mid-lesson does
  // not lose up to a debounce window of progress.
  useEffect(() => {
    // Captured inside the effect: by the time cleanup runs the ref may already
    // point at the next lesson's element, and we would save its position under
    // this lesson's id.
    const video = videoRef.current

    return () => {
      if (video && video.currentTime > 0) {
        persist.cancel()
        savePosition({ lessonId, lastPositionSec: Math.floor(video.currentTime) })
      }
    }
  }, [lessonId, persist, savePosition])

  if (!videoUrl) {
    return (
      <div className="relative">
        <VideoThumb className="rounded-none md:rounded-md" />
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/70">
          {t('PLAYER_NO_VIDEO')}
        </p>
      </div>
    )
  }

  // Full bleed on a phone — there the video is the screen, not a card on it.
  // Framed again from md upwards, where the page reads as a document.
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      playsInline
      className="aspect-video w-full bg-surface-dark md:rounded-lg"
      onTimeUpdate={(event) => persist(Math.floor(event.currentTarget.currentTime))}
      onEnded={onEnded}
    />
  )
}
