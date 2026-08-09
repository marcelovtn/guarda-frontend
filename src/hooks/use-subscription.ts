import { queryClient } from '@/lib/queryClient'
import { api } from '@/utils/axios'
import { useQuery } from '@tanstack/react-query'

export const subscriptionKeys = {
  all: ['subscription'] as const,
  isValid: (userId: string) => [...subscriptionKeys.all, 'isValid', userId] as const,
  status: (userId: string) => [...subscriptionKeys.all, 'status', userId] as const,
} as const

export type SubscriptionStatus = {
  isValid: boolean
  status: string | null
  hasSubscription: boolean
  trialStart: string | null
  trialEnd: string | null
  hasUsedTrial: boolean
}

export function useSubscriptionValid(userId: string) {
  return useQuery({
    queryKey: subscriptionKeys.isValid(userId),
    queryFn: async () => {
      const response = await api.get(`/api/subscriptions/isSubscriptionValid/${userId}`)
      return response.data
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 60 * 60 * 1000, // 60 minutos
  })
}

export function useSubscriptionStatus(userId: string) {
  return useQuery<SubscriptionStatus>({
    queryKey: subscriptionKeys.status(userId),
    queryFn: async () => {
      const response = await api.get(`/api/subscriptions/status/${userId}`)
      return response.data
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 60 * 60 * 1000, // 60 minutos
  })
}

export async function prefetchSubscriptionValid(userId: string) {
  await queryClient.prefetchQuery({
    queryKey: subscriptionKeys.isValid(userId),
    queryFn: async () => {
      const response = await api.get(`/api/subscriptions/isSubscriptionValid/${userId}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
