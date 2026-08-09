'use client'

import { publicRoutes } from '@/utils/routes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Forwards an OAuth code that landed on the landing page.
 *
 * Some providers redirect to the site root rather than the callback route, and
 * without this the user ends up staring at the sales page after authorising.
 */
export function ClientHandlers() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      router.push(`${publicRoutes.AUTH}/callback?code=${code}`)
    }
  }, [code, router])

  return null
}
