'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const SIZES = {
  xs: { box: 'size-6', text: 'text-[11px]' },
  sm: { box: 'size-9', text: 'text-xs' },
  md: { box: 'size-11', text: 'text-xs' },
  lg: { box: 'size-16', text: 'text-[22px]' },
  xl: { box: 'size-[88px]', text: 'text-[30px]' },
} as const

export type InstructorAvatarSize = keyof typeof SIZES

interface InstructorAvatarProps {
  name: string
  /** Resolved photo URL. Falls back to initials while absent. */
  src?: string | null
  size?: InstructorAvatarSize
  className?: string
}

/** First letter of the first and last name — "Rafael Moura" becomes RM. */
function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

/**
 * The instructor's photo, everywhere it appears: the header switcher, the row
 * under the player, the public profile and the profile editor.
 *
 * Initials are the fallback rather than a placeholder image, so a brand new
 * instructor without a photo still looks deliberate.
 */
export function InstructorAvatar({ name, src, size = 'sm', className }: InstructorAvatarProps) {
  const { box, text } = SIZES[size]

  return (
    <Avatar className={cn(box, 'shrink-0', className)}>
      {src ? <AvatarImage src={src} alt={name} className="object-cover" /> : null}
      <AvatarFallback
        className={cn('bg-surface-dark font-semibold text-surface-dark-foreground', text)}
      >
        {toInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
