import { api } from '@/utils/axios'
import { useQuery } from '@tanstack/react-query'
import type { MinimalUserInfoDTO, UserInfoDTO } from './types'

export const userInfoKeys = {
  all: ['userInfo'] as const,
  full: () => [...userInfoKeys.all, 'full'] as const,
  minimal: () => [...userInfoKeys.all, 'minimal'] as const,
}

export function useGetUserInfo() {
  return useQuery({
    queryKey: userInfoKeys.full(),
    queryFn: async (): Promise<{ data: UserInfoDTO }> => {
      const res = await api.get<UserInfoDTO>('/api/userInfo')
      return { data: res.data }
    },
  })
}

export function useGetMinimalUserInfo(enabled = true) {
  return useQuery({
    queryKey: userInfoKeys.minimal(),
    queryFn: async (): Promise<MinimalUserInfoDTO> => {
      const res = await api.get<MinimalUserInfoDTO>('/api/userInfo/minimal')
      return res.data
    },
    enabled,
  })
}
