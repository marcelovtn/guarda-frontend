import { authClient } from '@/lib/auth-client'
import axios from 'axios'
import { toast } from 'react-toastify'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authClient.signOut()
      window.location.href = '/auth/login'
      toast.error('Sessão expirada. Por favor, faça login novamente.')
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)
