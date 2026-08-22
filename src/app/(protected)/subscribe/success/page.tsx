'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSyncCheckoutSession } from '@/lib/payment/payment.slice'
import { useWaitForActiveSubscription } from '@/lib/subscription/subscription.slice'
import { studentRoutes } from '@/utils/routes'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** How long to wait before admitting something is wrong. */
const GIVE_UP_AFTER_MS = 20_000

/**
 * Where Stripe drops the student after a successful payment.
 *
 * This screen grants nothing and is not proof of anything — a student can close
 * the tab before it loads, or open this URL by hand. What it does is ask the
 * backend to reconcile the session (in case the webhook is late or was missed),
 * wait for access to appear, and stop pretending after 20 seconds.
 */
function SuccessContent() {
  const { t } = useTranslation('guarda')
  const searchParams = useSearchParams()
  const slug = searchParams.get('instructor')
  const sessionId = searchParams.get('session_id')

  const { isActive } = useWaitForActiveSubscription(slug)
  const { mutate: syncSession } = useSyncCheckoutSession()

  const [gaveUp, setGaveUp] = useState(false)
  const hasSynced = useRef(false)

  useEffect(() => {
    // Once per mount: React 18 runs effects twice in development, and this one
    // hits Stripe.
    if (!sessionId || hasSynced.current) return
    hasSynced.current = true
    syncSession(sessionId)
  }, [sessionId, syncSession])

  useEffect(() => {
    if (isActive) return
    const timer = setTimeout(() => setGaveUp(true), GIVE_UP_AFTER_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  const state = isActive ? 'active' : gaveUp ? 'stuck' : 'waiting'

  return (
    <div className="flex w-full max-w-[520px] flex-col items-center gap-8 text-center">
      {state === 'active' && <CheckCircle2 className="size-12 text-primary" />}
      {state === 'waiting' && <Loader2 className="size-12 animate-spin text-muted-foreground" />}
      {state === 'stuck' && <AlertCircle className="size-12 text-muted-foreground" />}

      <div className="flex flex-col gap-3">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t(
            state === 'active'
              ? 'SUCCESS_TITLE'
              : state === 'stuck'
                ? 'SUCCESS_STUCK_TITLE'
                : 'SUCCESS_PENDING_TITLE',
          )}
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          {t(
            state === 'active'
              ? 'SUCCESS_SUBTITLE'
              : state === 'stuck'
                ? 'SUCCESS_STUCK_SUBTITLE'
                : 'SUCCESS_PENDING_SUBTITLE',
          )}
        </p>
      </div>

      {/*
        The payment is not in doubt when we get here — Stripe only redirects
        after it clears. So even the stuck state offers the way in rather than
        parking the student on a dead end.
      */}
      {state !== 'waiting' && (
        <Button asChild size="lg" className="h-14 w-full text-base">
          <Link href={studentRoutes.HOME}>
            {t(state === 'active' ? 'SUCCESS_CTA' : 'SUCCESS_STUCK_CTA')}
          </Link>
        </Button>
      )}
    </div>
  )
}

export default function SubscribeSuccessPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[320px] w-full max-w-[520px]" />}>
      <SuccessContent />
    </Suspense>
  )
}
