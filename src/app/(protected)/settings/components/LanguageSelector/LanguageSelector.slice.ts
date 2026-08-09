import { api } from '@/utils/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUserLanguage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (language: 'pt' | 'en' | 'es') => {
      return api.put('/api/userInfo/language', { language })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserInfo'] })
    },
  })
}
