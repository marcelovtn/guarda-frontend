import { lessonKeys } from '@/lib/lesson/lesson.slice'
import { progressKeys } from '@/lib/progress/progress.slice'
import { trackKeys } from '@/lib/track/track.slice'
import { api } from '@/utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { Subscription } from './types'

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  list: () => [...subscriptionKeys.all, 'list'] as const,
}

export function useGetSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<Subscription[]>('/api/subscriptions')
      return data
    },
  })
}

/**
 * Subscribes to an instructor.
 *
 * No payment is taken — the row this writes is what every access check reads,
 * so the rest of the app behaves exactly as it will once billing exists.
 * Invalidates the content queries because access changes the moment it lands.
 */
export function useSubscribe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (instructorSlug: string) => {
      const { data } = await api.post<Subscription>('/api/subscriptions', { instructorSlug })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
      queryClient.invalidateQueries({ queryKey: trackKeys.all })
      queryClient.invalidateQueries({ queryKey: lessonKeys.all })
      queryClient.invalidateQueries({ queryKey: progressKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

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
