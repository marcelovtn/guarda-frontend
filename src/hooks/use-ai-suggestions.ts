'use client'

import { api } from '@/utils/axios'
import { useCallback, useState } from 'react'

export function useAISuggestions() {
  const [isLoading, setIsLoading] = useState(false)

  const sendChatMessageStream = useCallback(
    async (
      message: string,
      onChunk: (chunk: string) => void,
      onComplete: () => void,
      onError: (error: Error) => void,
      conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
    ) => {
      setIsLoading(true)

      try {
        // O axios já envia os cookies automaticamente (Better Auth)
        // Remove barra dupla caso baseURL termine com /
        const baseURL = api.defaults.baseURL?.replace(/\/$/, '') || ''
        const response = await fetch(`${baseURL}/api/ai-suggestions/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Envia cookies
          body: JSON.stringify({
            message,
            history: conversationHistory || [],
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let fullMessage = ''

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            fullMessage += chunk
            onChunk(chunk)
          }
        } finally {
          reader.releaseLock()
        }

        onComplete()
        return fullMessage
      } catch (error) {
        console.error('Error sending chat message stream:', error)
        onError(error as Error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    sendChatMessageStream,
    isLoading,
  }
}
