import { api } from '@/utils/axios'
import { useQuery } from '@tanstack/react-query'

export const platformKeys = {
  all: ['platform'] as const,
  stats: () => [...platformKeys.all, 'stats'] as const,
}

export interface PlatformStats {
  instructorCount: number
  trackCount: number
  lessonCount: number
}

/**
 * Public counts shown on the auth panel.
 *
 * Unauthenticated on purpose — the numbers are part of what convinces someone
 * to create an account, so they cannot sit behind a session.
 */
export function usePlatformStats() {
  return useQuery({
    queryKey: platformKeys.stats(),
    queryFn: async () => {
      const { data } = await api.get<PlatformStats>('/api/platform/stats')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
