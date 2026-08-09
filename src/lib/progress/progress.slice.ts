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

export interface SavedLesson {
  lessonId: string
  title: string
  durationSec: number
  savedAt: string
  track: LessonTrackRef | null
}

export const progressKeys = {
  all: ['progress'] as const,
  continue: () => [...progressKeys.all, 'continue'] as const,
  saved: () => [...progressKeys.all, 'saved'] as const,
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

export function useGetSavedLessons() {
  return useQuery({
    queryKey: progressKeys.saved(),
    queryFn: async () => {
      const { data } = await api.get<SavedLesson[]>('/api/progress/saved')
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

export function useToggleSavedLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lessonId, saved }: { lessonId: string; saved: boolean }) => {
      if (saved) {
        await api.post(`/api/progress/${lessonId}/save`)
        return
      }
      await api.delete(`/api/progress/${lessonId}/save`)
    },
    onSuccess: (_data, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.saved() })
      queryClient.invalidateQueries({ queryKey: lessonKeys.playback(lessonId) })
    },
  })
}
