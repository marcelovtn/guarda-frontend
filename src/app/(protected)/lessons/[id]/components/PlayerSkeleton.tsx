'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Mirrors the real player layout instead of showing two generic blocks.
 *
 * On a cold navigation there is no cached data to hold in place, so this is
 * what the student sees. Matching the final geometry means nothing jumps when
 * the data lands — the earlier version changed the page height and read as a
 * browser refresh.
 */
export function PlayerSkeleton() {
  return (
    <PageContainer className="flex flex-col gap-10 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Skeleton className="aspect-video w-full rounded-lg" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-8 w-full max-w-[520px]" />
            </div>
            <Skeleton className="h-9 w-full max-w-52 shrink-0" />
          </div>

          <Skeleton className="h-5 w-full max-w-[680px]" />
          <Skeleton className="h-5 w-full max-w-[560px]" />

          <div className="flex items-center gap-3.5 border-t border-border pt-5">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-[372px]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[420px] w-full rounded-lg" />
      </aside>
    </PageContainer>
  )
}
