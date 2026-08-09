'use client'

import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface InstructorSwitcherProps {
  name: string
  photoUrl?: string | null
}

/**
 * Names whose content the student is currently looking at.
 *
 * With one instructor it reads as a label; the chevron and the menu are what
 * reserve the space for a second one. Switching changes the whole app's
 * context — tracks and videos follow the selected instructor rather than being
 * merged into one feed, which is what keeps "na ordem certa" true.
 */
export function InstructorSwitcher({ name, photoUrl }: InstructorSwitcherProps) {
  const { t } = useTranslation('guarda')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex min-w-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="hidden h-[18px] w-px shrink-0 bg-border sm:block" />
        <InstructorAvatar name={name} src={photoUrl} size="xs" />
        <span className="hidden truncate text-sm font-semibold leading-[18px] sm:block">
          {name}
        </span>
        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[300px] p-2">
        <DropdownMenuLabel className="px-3 py-2 text-[11px] font-semibold tracking-caps text-muted-foreground">
          {t('SWITCHER_TITLE')}
        </DropdownMenuLabel>

        <DropdownMenuItem className="flex items-center gap-3 rounded-md bg-accent px-3 py-2.5">
          <InstructorAvatar name={name} src={photoUrl} size="sm" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span>
          <Check className="size-4 shrink-0 text-primary" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled
          className="flex items-center justify-between px-3 py-2.5 text-sm"
        >
          {t('SWITCHER_DISCOVER')}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold tracking-caps text-muted-foreground">
            {t('SWITCHER_SOON')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
