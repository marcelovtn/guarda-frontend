import { api } from '@/utils/axios'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type {
  CreateLessonPayload,
  InstructorLesson,
  InstructorLessonDetail,
  LessonListItem,
  LessonPlayback,
  LessonUploadTarget,
  UpdateLessonPayload,
  VideoProcessingStatus,
} from './types'

export const lessonKeys = {
  all: ['lessons'] as const,
  studentList: (filters?: string) => [...lessonKeys.all, 'student', filters ?? ''] as const,
  playback: (id: string) => [...lessonKeys.all, 'playback', id] as const,
  instructorList: () => [...lessonKeys.all, 'instructor'] as const,
  instructorDetail: (id: string) => [...lessonKeys.all, 'instructor', id] as const,
  processing: (id: string) => [...lessonKeys.all, 'processing', id] as const,
}

// --- student -----------------------------------------------------------------

export function useGetLessons(filters: { category?: string; orphansOnly?: boolean } = {}) {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.orphansOnly) params.set('orphans', 'true')
  const query = params.toString()

  return useQuery({
    queryKey: lessonKeys.studentList(query),
    queryFn: async () => {
      const { data } = await api.get<LessonListItem[]>(`/api/lessons${query ? `?${query}` : ''}`)
      return data
    },
    // Changing a filter changes the query key. Without this the grid collapses
    // to skeletons and rebuilds, which reads as the page flashing.
    placeholderData: keepPreviousData,
  })
}

/**
 * Warms a lesson before it is opened, on hover or focus.
 *
 * Without it the API call only starts once the route has committed, so the two
 * waits are serial. Prefetching overlaps them.
 */
export function usePrefetchLessonPlayback() {
  const queryClient = useQueryClient()

  return (id: string) =>
    queryClient.prefetchQuery({
      queryKey: lessonKeys.playback(id),
      queryFn: async () => {
        const { data } = await api.get<LessonPlayback>(`/api/lessons/${id}`)
        return data
      },
      staleTime: 30_000,
    })
}

export function useGetLessonPlayback(id: string) {
  return useQuery({
    queryKey: lessonKeys.playback(id),
    queryFn: async () => {
      const { data } = await api.get<LessonPlayback>(`/api/lessons/${id}`)
      return data
    },
    enabled: Boolean(id),
    // Moving to the next lesson is a new query key. Keeping the previous data
    // on screen means the sidebar and the layout stay put instead of the whole
    // page blanking out, which looked like a browser refresh.
    placeholderData: keepPreviousData,
  })
}

// --- instructor ---------------------------------------------------------------

export function useGetInstructorLessons() {
  return useQuery({
    queryKey: lessonKeys.instructorList(),
    queryFn: async () => {
      const { data } = await api.get<InstructorLesson[]>('/api/instructor/lessons')
      return data
    },
    retry: false,
  })
}

export function useGetInstructorLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.instructorDetail(id),
    queryFn: async () => {
      const { data } = await api.get<InstructorLessonDetail>(`/api/instructor/lessons/${id}`)
      return data
    },
    enabled: Boolean(id),
    retry: false,
  })
}

/**
 * Asks the backend where to PUT a lesson video.
 *
 * Goes through the lesson module rather than the generic storage endpoint, so
 * the destination follows VideoProvider when the pipeline changes.
 */
export function useCreateLessonUploadTarget() {
  return useMutation({
    mutationFn: async (file: File) => {
      const { data } = await api.post<LessonUploadTarget>('/api/instructor/lessons/upload-target', {
        fileName: file.name,
        contentType: file.type,
      })
      return data
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

export function useCreateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateLessonPayload) => {
      const { data } = await api.post<InstructorLesson>('/api/instructor/lessons', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

export function useUpdateLesson(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateLessonPayload) => {
      const { data } = await api.patch(`/api/instructor/lessons/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/instructor/lessons/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

/**
 * Polls while the video is being processed.
 *
 * Stops once the state settles, so a finished lesson does not keep a timer
 * running on the page.
 */
export function useLessonProcessingStatus(id: string | null) {
  return useQuery({
    queryKey: lessonKeys.processing(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<VideoProcessingStatus>(
        `/api/instructor/lessons/${id}/processing`,
      )
      return data
    },
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const state = query.state.data?.state
      return state === 'ready' || state === 'failed' ? false : 3000
    },
  })
}
