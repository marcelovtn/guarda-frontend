import { api } from '@/utils/axios'
import { useCallback } from 'react'

type CreateSessionParams = {
  priceId?: string
  lookupKey?: string
  plan?: 'monthly' | 'annual'
  customerEmail?: string
  successPath?: string
  cancelPath?: string
  isAffiliate?: boolean
}

const useStripeCheckout = () => {
  const createSubscriptionSession = useCallback(async (params: CreateSessionParams) => {
    try {
      // 1. ✅ RECUPERAR A FLAG do LocalStorage
      let isAffiliate = false
      if (typeof window !== 'undefined') {
        const storedRef = localStorage.getItem('amfinance_session_ref')
        isAffiliate = storedRef === 'true'
      }

      // 2. ✅ ENVIAR PARA O BACKEND (mesmo que já venha nos params, prioriza o localStorage)
      const response = await api.post('/api/stripe/create-checkout-session', {
        ...params,
        isAffiliate: params.isAffiliate ?? isAffiliate,
      })
      const data = response.data as { url?: string }

      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('Sessão criada sem URL')
    } catch (e) {
      console.error(e)
      throw e
    }
  }, [])

  const openCustomerPortal = useCallback(
    async (params: { customerId?: string; customerEmail?: string; returnPath?: string }) => {
      try {
        const response = await api.post('/api/stripe/create-portal-session', params)
        const data = response.data as { url?: string }

        if (data.url) {
          window.location.href = data.url
          return
        }
        throw new Error('Sessão do portal criada sem URL')
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    [],
  )

  const openCustomerPortalSimple = useCallback(async (returnPath: string = '/settings') => {
    try {
      const response = await api.post('/api/stripe/customer-portal', { returnPath })
      const data = response.data as { url?: string }

      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('Sessão do portal criada sem URL')
    } catch (e) {
      console.error(e)
      throw e
    }
  }, [])

  return { createSubscriptionSession, openCustomerPortal, openCustomerPortalSimple }
}

export default useStripeCheckout
