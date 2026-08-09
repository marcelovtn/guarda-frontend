import { api } from '@/utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type {
  CreateTrackPayload,
  InstructorTrackSummary,
  SaveTrackStructurePayload,
  TrackDetail,
  TrackSummary,
  UpdateTrackPayload,
} from './types'

export const trackKeys = {
  all: ['tracks'] as const,
  studentList: () => [...trackKeys.all, 'student'] as const,
  studentDetail: (slug: string) => [...trackKeys.all, 'student', slug] as const,
  recommended: () => [...trackKeys.all, 'recommended'] as const,
  instructorList: () => [...trackKeys.all, 'instructor'] as const,
  instructorDetail: (id: string) => [...trackKeys.all, 'instructor', id] as const,
}

// --- student -----------------------------------------------------------------

export function useGetTracks() {
  return useQuery({
    queryKey: trackKeys.studentList(),
    queryFn: async () => {
      const { data } = await api.get<TrackSummary[]>('/api/tracks')
      return data
    },
  })
}

export function useGetTrack(slug: string) {
  return useQuery({
    queryKey: trackKeys.studentDetail(slug),
    queryFn: async () => {
      const { data } = await api.get<TrackDetail>(`/api/tracks/${slug}`)
      return data
    },
    enabled: Boolean(slug),
  })
}

/** What the first-access home offers under "Comece por aqui". */
export function useGetRecommendedTrack() {
  return useQuery({
    queryKey: trackKeys.recommended(),
    queryFn: async () => {
      const { data } = await api.get<TrackSummary | null>('/api/tracks/recommended')
      return data
    },
  })
}

// --- instructor ---------------------------------------------------------------

export function useGetInstructorTracks() {
  return useQuery({
    queryKey: trackKeys.instructorList(),
    queryFn: async () => {
      const { data } = await api.get<InstructorTrackSummary[]>('/api/instructor/tracks')
      return data
    },
    retry: false,
  })
}

export function useGetInstructorTrack(id: string) {
  return useQuery({
    queryKey: trackKeys.instructorDetail(id),
    queryFn: async () => {
      const { data } = await api.get(`/api/instructor/tracks/${id}`)
      return data
    },
    enabled: Boolean(id),
    retry: false,
  })
}

export function useCreateTrack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTrackPayload) => {
      const { data } = await api.post('/api/instructor/tracks', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.instructorList() })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

export function useUpdateTrack(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateTrackPayload) => {
      const { data } = await api.patch(`/api/instructor/tracks/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

export function useDeleteTrack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/instructor/tracks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}

/**
 * Saves the modules and their lesson order in one request.
 *
 * The builder lets the instructor rearrange freely and press save once; sending
 * each move separately would leave lessons stranded if one call failed.
 */
export function useSaveTrackStructure(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SaveTrackStructurePayload) => {
      const { data } = await api.put(`/api/instructor/tracks/${id}/structure`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.all })
    },
    onError: (error: any) => toast.error(error?.response?.data?.error ?? error.message),
  })
}
