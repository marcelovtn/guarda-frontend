import type { DeleteAccountResult } from '@/lib/userData/types'
import { api } from '@/utils/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useDeleteAccount() {
  return useMutation<DeleteAccountResult, Error>({
    mutationFn: () => api.delete('/api/user-data/account'),
    onError: (error: any) => {
      const apiError = error?.response?.data?.error as string | undefined
      toast.error(apiError ?? error.message ?? 'Erro ao deletar conta')
    },
  })
}
