'use client'

import { cn } from '@/lib/utils'
import { Lock, Play } from 'lucide-react'
import type { ReactNode } from 'react'

interface VideoThumbProps {
  /** Poster image. Falls back to the dark gradient while absent. */
  src?: string | null
  alt?: string
  /** Bottom-right chip: duration, or "24 aulas" on a track card. */
  badge?: string
  /** Shows a padlock next to the badge, for content behind the paywall. */
  locked?: boolean
  /** Centred play affordance, for the hero. */
  showPlay?: boolean
  /** Top-left chip: "AULA 07". */
  eyebrow?: string
  /** Rendered over the bottom edge — the hero uses it for a progress bar. */
  footer?: ReactNode
  className?: string
}

/**
 * The 16:9 frame every piece of video content sits in.
 *
 * A lesson has no poster until the video pipeline generates one, so the
 * fallback is a gradient rather than a grey box with a broken-image icon —
 * that is the state the artboards were drawn in and it has to look intentional.
 */
export function VideoThumb({
  src,
  alt = '',
  badge,
  locked = false,
  showPlay = false,
  eyebrow,
  footer,
  className,
}: VideoThumbProps) {
  return (
    <div
      className={cn(
        'relative aspect-video w-full shrink-0 overflow-hidden rounded-md',
        'bg-[linear-gradient(158deg,#26241f_0%,#14130f_64%)]',
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : null}

      {eyebrow ? (
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-caps text-white/85">
          {eyebrow}
        </span>
      ) : null}

      {showPlay ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-[76px] items-center justify-center rounded-full bg-white/95">
            <Play className="ml-1 size-7 fill-surface-dark text-surface-dark" />
          </span>
        </span>
      ) : null}

      {badge ? (
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/85">
          {locked ? <Lock className="size-3" /> : null}
          {badge}
        </span>
      ) : null}

      {footer ? <div className="absolute inset-x-3 bottom-3">{footer}</div> : null}
    </div>
  )
}
