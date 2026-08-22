'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/EmptyState'
import { DEFAULT_INSTRUCTOR_SLUG } from '@/lib/instructor/defaultInstructor'
import { useGetPublicInstructor } from '@/lib/instructor/instructor.slice'
import { useSubscribe } from '@/lib/subscription/subscription.slice'
import { cn } from '@/lib/utils'
import { formatPriceFromCents } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { CreditCard, Landmark, RefreshCw, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'

type PaymentMethod = 'card' | 'pix'

function CheckoutContent() {
  const { t } = useTranslation('guarda')
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('instructor') ?? DEFAULT_INSTRUCTOR_SLUG

  const { data: instructor, isLoading } = useGetPublicInstructor(slug)
  const { mutateAsync: subscribe, isPending } = useSubscribe()
  const [method, setMethod] = useState<PaymentMethod>('card')

  /*
   * Sem professor não é carregamento, é resposta. Ver a mesma guarda na tela de
   * planos: tratar os dois casos com um skeleton só deixava um retângulo cinza
   * que nunca resolvia.
   */
  if (!slug || (!isLoading && !instructor)) {
    return (
      <EmptyState
        title={t('SUBSCRIBE_NO_INSTRUCTOR_TITLE')}
        description={t('SUBSCRIBE_NO_INSTRUCTOR_BODY')}
        className="w-full max-w-[520px]"
      />
    )
  }

  if (isLoading || !instructor) {
    return <Skeleton className="h-[520px] w-full max-w-[900px]" />
  }

  // A const arrow, not a declaration: a hoisted function is not covered by the
  // narrowing from the guard above.
  const handleSubscribe = async () => {
    await subscribe(instructor.slug)
    router.push(studentRoutes.HOME)
  }

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-12 lg:flex-row lg:items-start">
      <div className="flex flex-1 flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-xl font-black tracking-tight text-foreground">
            {t('CHECKOUT_TITLE')}
          </h1>
          <p className="text-base text-muted-foreground">{t('CHECKOUT_SUBTITLE')}</p>
        </header>

        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {t('CHECKOUT_METHOD')}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <MethodOption
              active={method === 'card'}
              icon={<CreditCard className="size-5" />}
              title={t('CHECKOUT_CARD')}
              subtitle={t('CHECKOUT_CARD_NOTE')}
              onClick={() => setMethod('card')}
            />
            <MethodOption
              active={method === 'pix'}
              icon={<Landmark className="size-5" />}
              title={t('CHECKOUT_PIX')}
              subtitle={t('CHECKOUT_PIX_NOTE')}
              onClick={() => setMethod('pix')}
            />
          </div>
        </section>

        {/*
          No card fields. Billing is being built separately, and a form that
          collects a card number while charging nothing would be worse than an
          honest placeholder.
        */}
        <p className="rounded-md bg-secondary/60 p-5 text-sm leading-6 text-muted-foreground">
          {t('CHECKOUT_MOCK_NOTICE')}
        </p>

        <div className="flex flex-col gap-4 rounded-md bg-secondary/60 p-5">
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
          className="h-14 w-full text-base"
          onClick={handleSubscribe}
          disabled={isPending}
        >
          {isPending ? t('CHECKOUT_SUBMITTING') : t('CHECKOUT_SUBMIT')}
        </Button>
      </aside>
    </div>
  )
}

function MethodOption({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-md border p-4 text-left transition-colors',
        active ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-secondary/40',
      )}
    >
      <span className={active ? 'text-primary' : 'text-muted-foreground'}>{icon}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[520px] w-full max-w-[900px]" />}>
      <CheckoutContent />
    </Suspense>
  )
}
