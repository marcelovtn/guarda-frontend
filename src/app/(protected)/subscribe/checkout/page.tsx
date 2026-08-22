'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetPublicInstructor } from '@/lib/instructor/instructor.slice'
import { useCreateCheckoutSession } from '@/lib/payment/payment.slice'
import { formatPriceFromCents } from '@/utils/formatLesson'
import { CreditCard, Lock, RefreshCw, XCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const DEFAULT_INSTRUCTOR = 'joaopedro'

function CheckoutContent() {
  const { t } = useTranslation('guarda')
  const searchParams = useSearchParams()
  const slug = searchParams.get('instructor') ?? DEFAULT_INSTRUCTOR

  const { data: instructor, isLoading } = useGetPublicInstructor(slug)
  const { mutate: startCheckout, isPending } = useCreateCheckoutSession()

  if (isLoading || !instructor) {
    return <Skeleton className="h-[520px] w-full max-w-[900px]" />
  }

  /*
    There is no payment method picker and no card fields.
    Stripe Checkout collects the card on its own domain, which is what keeps
    this app out of PCI scope, and which methods it offers is a Dashboard
    setting rather than something hardcoded here.
  */
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-12 lg:flex-row lg:items-start">
      <div className="flex flex-1 flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-xl font-black tracking-tight text-foreground">
            {t('CHECKOUT_TITLE')}
          </h1>
          <p className="text-base text-muted-foreground">{t('CHECKOUT_SUBTITLE')}</p>
        </header>

        <div className="flex flex-col gap-4 rounded-md bg-secondary/60 p-5">
          <p className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0" />
            {t('CHECKOUT_SECURE')}
          </p>
          <p className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <RefreshCw className="mt-0.5 size-4 shrink-0" />
            {t('CHECKOUT_RENEWAL')}
          </p>
          <p className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <XCircle className="mt-0.5 size-4 shrink-0" />
            {t('CHECKOUT_CANCEL')}
          </p>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-5 rounded-lg border border-border bg-card p-7 lg:w-[380px]">
        <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {t('CHECKOUT_SUMMARY')}
        </p>

        <div className="flex flex-col gap-1">
          <p className="font-display text-lg font-bold tracking-tight text-foreground">
            {t('CHECKOUT_PLAN', { name: instructor.displayName })}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {t('CHECKOUT_PLAN_NOTE', {
              tracks: instructor.stats.trackCount,
              lessons: instructor.stats.lessonCount,
            })}
          </p>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-5">
          <span className="text-sm text-muted-foreground">{t('CHECKOUT_MONTHLY')}</span>
          <span className="text-sm tabular-nums text-foreground">
            {formatPriceFromCents(instructor.monthlyPrice)}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-5">
          <span className="text-base font-semibold text-foreground">{t('CHECKOUT_TOTAL')}</span>
          <span className="font-display text-xl font-black tabular-nums tracking-tight text-foreground">
            {formatPriceFromCents(instructor.monthlyPrice)}
          </span>
        </div>

        <Button
          size="lg"
          className="h-14 w-full gap-2 text-base"
          onClick={() => startCheckout(instructor.slug)}
          disabled={isPending}
        >
          <CreditCard className="size-5" />
          {isPending ? t('CHECKOUT_SUBMITTING') : t('CHECKOUT_SUBMIT')}
        </Button>
      </aside>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[520px] w-full max-w-[900px]" />}>
      <CheckoutContent />
    </Suspense>
  )
}
