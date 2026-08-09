// src/hooks/useAffiliateTracker.ts
import { useEffect } from 'react'

// CONFIGURAÇÃO
const URL_PARAM = '_sid' // O parâmetro na URL (ex: meusaas.com/?_sid=...)
const STORAGE_KEY = 'amfinance_session_ref' // Chave interna do navegador
const TARGET_HASH = 'bWFya2V0aW5n' // Base64 para 'marketing'

export const useAffiliateTracker = () => {
  useEffect(() => {
    // Evita execução no Server-Side (Next.js)
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const code = params.get(URL_PARAM)

    if (code) {
      // Salva o código do parceiro para enviar no sign-up e na verificação
      if (code === TARGET_HASH) {
        localStorage.setItem(STORAGE_KEY, code)
      }

      // 2. LIMPEZA DA URL (Stealth Mode)
      // Remove o parâmetro visualmente sem recarregar a página
      // params.delete(URL_PARAM)

      const newPath = window.location.pathname + (params.toString() ? '?' + params.toString() : '')

      window.history.replaceState({}, '', newPath)
    }
  }, [])
}
