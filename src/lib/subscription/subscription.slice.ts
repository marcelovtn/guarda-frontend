import { lessonKeys } from '@/lib/lesson/lesson.slice'
import { progressKeys } from '@/lib/progress/progress.slice'
import { trackKeys } from '@/lib/track/track.slice'
import { api } from '@/utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import type { Subscription } from './types'

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  list: () => [...subscriptionKeys.all, 'list'] as const,
}

async function fetchSubscriptions() {
  const { data } = await api.get<Subscription[]>('/api/subscriptions')
  return data
}

export function useGetSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: fetchSubscriptions,
  })
}

/**
 * Waits for a subscription to show up as ACTIVE after checkout.
 *
 * Stripe redirects the student back the moment the card clears, which can be
 * before the webhook that grants access has landed. So this polls instead of
 * reading once — the alternative would be a success screen that says "you're
 * in" next to a catalogue the student cannot open yet.
 *
 * Polling stops as soon as the row appears, and the content caches are dropped
 * at that point because access has just changed.
 */
export function useWaitForActiveSubscription(instructorSlug: string | null) {
  const queryClient = useQueryClient()

  const isActive = (subscriptions: Subscription[] | undefined) =>
    !!subscriptions?.some((s) => s.instructor.slug === instructorSlug && s.status === 'ACTIVE')

  const query = useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: fetchSubscriptions,
    enabled: !!instructorSlug,
    refetchInterval: ({ state }) => (isActive(state.data) ? false : 2000),
  })

  const active = isActive(query.data)

  useEffect(() => {
    if (!active) return

    queryClient.invalidateQueries({ queryKey: trackKeys.all })
    queryClient.invalidateQueries({ queryKey: lessonKeys.all })
    queryClient.invalidateQueries({ queryKey: progressKeys.all })
  }, [active, queryClient])

  return { isActive: active, isWaiting: query.isLoading || (!active && query.isFetching) }
}

/**
 * Cancels the subscription.
 *
 * The backend cancels at Stripe and the row changes when the webhook arrives,
 * so the list is invalidated rather than updated optimistically — the status
 * shown has to be the status Stripe reported.
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (instructorSlug: string) => {
      await api.delete(`/api/subscriptions/${instructorSlug}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
      queryClient.invalidateQueries({ queryKey: trackKeys.all })
      queryClient.invalidateQueries({ queryKey: lessonKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}
