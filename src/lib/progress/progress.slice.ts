import type { LessonTrackRef } from '@/lib/lesson/types'
import { lessonKeys } from '@/lib/lesson/lesson.slice'
import { trackKeys } from '@/lib/track/track.slice'
import { api } from '@/utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface ContinueWatching {
  lessonId: string
  title: string
  description: string | null
  durationSec: number
  lastPositionSec: number
  remainingSec: number
  track: LessonTrackRef | null
}

export const progressKeys = {
  all: ['progress'] as const,
  continue: () => [...progressKeys.all, 'continue'] as const,
}

/** Drives the home hero. Null means the student has not started anything. */
export function useGetContinueWatching() {
  return useQuery({
    queryKey: progressKeys.continue(),
    queryFn: async () => {
      const { data } = await api.get<ContinueWatching | null>('/api/progress/continue')
      return data
    },
  })
}

/**
 * Saves the playback position.
 *
 * Fired repeatedly while the video plays, so it deliberately does not
 * invalidate anything — refetching the track on every tick would fight the
 * player for bandwidth. The lists catch up when the lesson is completed.
 */
export function useSavePosition() {
  return useMutation({
    mutationFn: async ({
      lessonId,
      lastPositionSec,
    }: {
      lessonId: string
      lastPositionSec: number
    }) => {
      await api.put(`/api/progress/${lessonId}`, { lastPositionSec })
    },
  })
}

export function useSetLessonCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
      if (completed) {
        await api.post(`/api/progress/${lessonId}/complete`)
        return
      }
      await api.delete(`/api/progress/${lessonId}/complete`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all })
      queryClient.invalidateQueries({ queryKey: trackKeys.all })
      queryClient.invalidateQueries({ queryKey: lessonKeys.all })
    },
  })
}
