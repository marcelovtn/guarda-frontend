'use client'
import AmLogo from '@/components/layout/AmLogo/Index'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/queryClient'
import { publicRoutes } from '@/utils/routes'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // localStorage.clear()
    sessionStorage.clear()
    queryClient.clear()
  }, [])

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      {/* Logo no topo */}
      <div className="absolute left-4 top-4">
        <Button variant="ghost" onClick={() => router.push(publicRoutes.INTRODUCTION)}>
          <AmLogo />
        </Button>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
