'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetPublicInstructor } from '@/lib/instructor/instructor.slice'
import { formatPriceFromCents } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Until there is a marketplace, everyone lands on the single instructor the
 * platform was set up for. The slug stays a parameter so the multi-instructor
 * flow is a link away rather than a rewrite.
 */
const DEFAULT_INSTRUCTOR = 'rafaelmoura'

const FEATURES = ['1', '2', '3'] as const

function PlansContent() {
  const { t } = useTranslation('guarda')
  const searchParams = useSearchParams()
  const slug = searchParams.get('instructor') ?? DEFAULT_INSTRUCTOR

  const { data: instructor, isLoading } = useGetPublicInstructor(slug)

  if (isLoading || !instructor) {
    return <Skeleton className="h-[520px] w-full max-w-[520px]" />
  }

  return (
    <div className="flex w-full max-w-[720px] flex-col items-center gap-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-caps text-primary">
          {t('PLANS_EYEBROW')}
        </p>

        <h1 className="max-w-[560px] font-display text-2xl font-black leading-[1.05] tracking-tight text-foreground">
          {t('PLANS_TITLE', { name: instructor.displayName })}
        </h1>

        <p className="max-w-[520px] text-base leading-7 text-muted-foreground">
          {t('PLANS_BODY', {
            tracks: instructor.stats.trackCount,
            lessons: instructor.stats.lessonCount,
          })}
        </p>
      </div>

      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-lg bg-surface-dark p-8 text-left text-surface-dark-foreground">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-caps text-white/45">
            {t('PLANS_MONTHLY')}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-caps text-white/70">
            {t('PLANS_NO_LOCKIN')}
          </span>
        </div>

        <p className="flex items-baseline gap-1">
          <span className="font-display text-[52px] font-black leading-none tracking-tight">
            {formatPriceFromCents(instructor.monthlyPrice)}
          </span>
          <span className="text-base text-white/45">{t('PLANS_PER_MONTH')}</span>
        </p>

        <p className="text-sm leading-6 text-white/55">{t('PLANS_CHARGE_NOTE')}</p>

        <Button asChild size="lg" className="h-14 w-full text-base">
          <Link href={`${studentRoutes.SUBSCRIBE_CHECKOUT}?instructor=${instructor.slug}`}>
            {t('PLANS_CTA')}
          </Link>
        </Button>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
            <Check className="size-4 text-primary" strokeWidth={3} />
            {t(`PLANS_FEATURE_${feature}`)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PlansPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[520px] w-full max-w-[520px]" />}>
      <PlansContent />
    </Suspense>
  )
}
