'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Bounce, ToastContainer } from 'react-toastify'

export function ToastProvider() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      transition={Bounce}
    />
  )
}
