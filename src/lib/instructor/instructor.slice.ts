import { api } from '@/utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type {
  InstructorProfile,
  InstructorStudent,
  PublicInstructor,
  UpdateInstructorProfilePayload,
} from './types'

export const instructorKeys = {
  all: ['instructor'] as const,
  profile: () => [...instructorKeys.all, 'profile'] as const,
  students: () => [...instructorKeys.all, 'students'] as const,
  public: (slug: string) => [...instructorKeys.all, 'public', slug] as const,
}

/** The signed-in instructor's own profile. 403s for a student. */
export function useGetInstructorProfile(enabled = true) {
  return useQuery({
    queryKey: instructorKeys.profile(),
    queryFn: async () => {
      const { data } = await api.get<InstructorProfile>('/api/instructor/profile')
      return data
    },
    enabled,
    // A student is not an instructor and never will be by retrying.
    retry: false,
  })
}

export function useUpdateInstructorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateInstructorProfilePayload) => {
      const { data } = await api.patch<InstructorProfile>('/api/instructor/profile', payload)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(instructorKeys.profile(), data)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? error.message)
    },
  })
}

export function useGetInstructorStudents() {
  return useQuery({
    queryKey: instructorKeys.students(),
    queryFn: async () => {
      const { data } = await api.get<InstructorStudent[]>('/api/instructor/students')
      return data
    },
    retry: false,
  })
}

/** Public profile behind the paywall, by slug. */
export function useGetPublicInstructor(slug: string) {
  return useQuery({
    queryKey: instructorKeys.public(slug),
    queryFn: async () => {
      const { data } = await api.get<PublicInstructor>(`/api/instructors/${slug}`)
      return data
    },
    enabled: Boolean(slug),
    // Um slug que não existe não passa a existir na terceira tentativa.
    retry: false,
  })
}
