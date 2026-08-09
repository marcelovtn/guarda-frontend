import { subscriptionKeys } from '@/hooks/use-subscription'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/utils/axios'

export async function userCan(user_id: string) {
  // Tenta buscar do cache primeiro
  const cachedData = queryClient.getQueryData(subscriptionKeys.isValid(user_id))
  if (cachedData !== undefined) {
    return cachedData
  }

  try {
    const response = await api.get('/api/subscriptions/isSubscriptionValid')
    const result = response.data
    queryClient.setQueryData(subscriptionKeys.isValid(user_id), result)
    return result
  } catch (error) {
    console.error('Error checking subscription validity:', error)
    return false
  }
}
