import { useEffect, useState } from 'react'

export const useDetectKeyboardOpen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const minKeyboardHeight = 300

  useEffect(() => {
    const listener = () => {
      if (!window.visualViewport) return
      const newState = window.screen.height - minKeyboardHeight > window.visualViewport.height
      if (isKeyboardOpen !== newState) {
        setIsKeyboardOpen(newState)
      }
    }
    if (typeof visualViewport !== 'undefined') {
      if (!window.visualViewport) return
      window.visualViewport.addEventListener('resize', listener)
    }
    return () => {
      if (typeof visualViewport !== 'undefined') {
        if (!window.visualViewport) return
        window.visualViewport.removeEventListener('resize', listener)
      }
    }
  }, [isKeyboardOpen, minKeyboardHeight])

  return isKeyboardOpen
}
