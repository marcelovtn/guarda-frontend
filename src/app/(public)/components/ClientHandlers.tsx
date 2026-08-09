'use client'

import { useAffiliateTracker } from '@/hooks/useAffiliateTracker'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function ClientHandlers() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useAffiliateTracker()

  useEffect(() => {
    if (code) {
      router.push(`/auth/callback?code=${code}`)
    }
  }, [code, router])

  return null
}
