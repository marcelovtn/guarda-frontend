import { api } from '@/utils/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

type Redirect = { url: string }

/**
 * Opens Stripe Checkout.
 *
 * There is no cache to invalidate on success: nothing has been bought yet. The
 * student leaves for Stripe and comes back to /subscribe/success, which waits
 * for the webhook to grant access.
 *
 * `window.location.href` rather than a <Link>, because the destination is
 * Stripe's domain — the navigation rule in CLAUDE.md is about routes inside the
 * app.
 */
export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (instructorSlug: string) => {
      const { data } = await api.post<Redirect>('/api/payment/checkout-session', {
        instructorSlug,
      })
      return data
    },
    onSuccess: ({ url }) => {
      window.location.href = url
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

/**
 * Opens the Stripe billing portal, where the student changes their card, reads
 * invoices or cancels. Cancelling there reaches us as a webhook, the same as
 * cancelling in the app does.
 */
export function useOpenBillingPortal() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Redirect>('/api/payment/portal-session')
      return data
    },
    onSuccess: ({ url }) => {
      window.location.href = url
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

/**
 * Asks the backend to reconcile one checkout session against Stripe.
 *
 * The webhook is what normally grants access. This is the recovery path for
 * when it is late or was missed entirely — the student is standing on the
 * success screen, and their browser knows the session id, so it can ask.
 *
 * Errors are swallowed on purpose: this runs in the background behind a screen
 * that already says "confirming", and a toast about a failed reconciliation
 * would only alarm someone whose payment is probably fine.
 */
export function useSyncCheckoutSession() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await api.post<{ settled: boolean }>(
        `/api/payment/checkout-session/${sessionId}/sync`,
      )
      return data
    },
  })
}
