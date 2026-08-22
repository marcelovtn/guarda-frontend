'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useOpenBillingPortal } from '@/lib/payment/payment.slice'
import { useGetSubscriptions } from '@/lib/subscription/subscription.slice'
import { formatPriceFromCents } from '@/utils/formatLesson'
import { studentRoutes } from '@/utils/routes'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

function formatDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('pt-BR')
}

/**
 * Where a paying student changes their card, reads invoices or cancels.
 *
 * All three happen in Stripe's billing portal rather than in screens here. The
 * checkout copy promises cancelling "direto no app, sem precisar ligar pra
 * ninguém" — one button that lands on it keeps that promise, and the portal is
 * always in sync with what Stripe is actually charging.
 */
export function BillingCard() {
  const { t } = useTranslation('guarda')
  const { data: subscriptions, isLoading } = useGetSubscriptions()
  const { mutate: openPortal, isPending } = useOpenBillingPortal()

  if (isLoading) {
    return <Skeleton className="h-[220px] w-full" />
  }

  const active = subscriptions?.filter((s) => s.status !== 'CANCELED') ?? []

  return (
    <section className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
          {t('BILLING_TITLE')}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{t('BILLING_SUBTITLE')}</p>
      </header>

      {active.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">{t('BILLING_EMPTY')}</p>
          <Button asChild variant="secondary">
            <Link href={studentRoutes.SUBSCRIBE_PLANS}>{t('BILLING_EMPTY_CTA')}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          {active.map((subscription) => {
            const renewsAt = formatDate(subscription.renewsAt)

            return (
              <div
                key={subscription.id}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">
                    {subscription.instructor.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.status === 'PAST_DUE'
                      ? t('BILLING_PAST_DUE')
                      : renewsAt
                        ? t('BILLING_RENEWS_AT', { date: renewsAt })
                        : t('BILLING_ACTIVE')}
                  </p>
                </div>

                <p className="text-sm tabular-nums text-foreground">
                  {t('BILLING_PER_MONTH', {
                    price: formatPriceFromCents(subscription.monthlyPrice),
                  })}
                </p>
              </div>
            )
          })}

          <Button
            variant="secondary"
            className="mt-2 gap-2 self-start"
            onClick={() => openPortal()}
            disabled={isPending}
          >
            <ExternalLink className="size-4" />
            {isPending ? t('BILLING_OPENING') : t('BILLING_MANAGE')}
          </Button>
        </div>
      )}
    </section>
  )
}
