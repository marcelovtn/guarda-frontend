'use client'

import { VideoThumb } from '@/components/layout/VideoThumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDuration, formatTotalDuration } from '@/utils/formatLesson'
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DraftModule } from '../useTrackDraft'

interface ModuleCardProps {
  module: DraftModule
  index: number
  /** Running lesson number across the whole track, for this module's first row. */
  startPosition: number
  onRename: (title: string) => void
  onRemove: () => void
  onReorderLesson: (index: number, delta: number) => void
  onDetachLesson: (lessonId: string) => void
}

/**
 * One module and its lessons in the builder.
 *
 * Reordering is by explicit up/down controls rather than drag-and-drop: the
 * same screen has to work on a phone, where dragging a row inside a scrolling
 * list fights the scroll gesture.
 */
export function ModuleCard({
  module,
  index,
  startPosition,
  onRename,
  onRemove,
  onReorderLesson,
  onDetachLesson,
}: ModuleCardProps) {
  const { t } = useTranslation('guarda')

  const totalDuration = module.lessons.reduce((sum, lesson) => sum + lesson.durationSec, 0)

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-3">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {t('BUILDER_MODULE', { number: index + 1 })}
        </span>

        <Input
          value={module.title}
          onChange={(event) => onRename(event.target.value)}
          className="h-9 flex-1 border-transparent bg-transparent px-2 text-base font-semibold hover:border-border focus:border-border"
        />

        <span className="hidden shrink-0 text-xs text-muted-foreground md:block">
          {t('LESSON_COUNT', { count: module.lessons.length })} ·{' '}
          {formatTotalDuration(totalDuration)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onRemove}>{t('BUILDER_REMOVE_MODULE')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {module.lessons.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            {t('BUILDER_MODULE_EMPTY')}
          </p>
        ) : (
          module.lessons.map((lesson, lessonIndex) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
            >
              <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                {String(startPosition + lessonIndex).padStart(2, '0')}
              </span>

              {/* The thumbnail and the duration are the first things to go on a
                  phone: with seven fixed-width slots in 375px the title was left
                  with a single character. */}
              <VideoThumb className="hidden w-14 shrink-0 rounded-sm sm:block" />

              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">{lesson.title}</span>
                <span className="text-xs tabular-nums text-muted-foreground sm:hidden">
                  {formatDuration(lesson.durationSec)}
                </span>
              </span>

              <span className="hidden w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground sm:block">
                {formatDuration(lesson.durationSec)}
              </span>

              <div className="flex shrink-0 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={lessonIndex === 0}
                  aria-label={t('BUILDER_MOVE_UP')}
                  onClick={() => onReorderLesson(lessonIndex, -1)}
                >
                  <ChevronUp className="size-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={lessonIndex === module.lessons.length - 1}
                  aria-label={t('BUILDER_MOVE_DOWN')}
                  onClick={() => onReorderLesson(lessonIndex, 1)}
                >
                  <ChevronDown className="size-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onDetachLesson(lesson.id)}>
                      {t('BUILDER_DETACH')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
