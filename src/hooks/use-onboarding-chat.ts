'use client'

import { api } from '@/utils/axios'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface OnboardingCategory {
  name: string
  type: 'ESSENTIAL' | 'LEISURE' | 'INVESTMENT'
  amount: number
}

export interface OnboardingFinanceOrganization {
  essential: number
  leisure: number
  investment: number
}

export type OnboardingUIHint = 'QUICK_REPLIES' | 'FREE_TEXT' | 'EXPENSE_PICKER' | 'NONE' | null

export interface OnboardingMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  uiHint?: OnboardingUIHint
  quickReplies?: string[]
}

interface ParsedOnboardingData {
  categories: OnboardingCategory[]
  financeOrganization?: OnboardingFinanceOrganization
  income?: number
}

// ─── Fixed local steps (no API call) ──────────────────────────────────────────

interface LocalStep {
  text: string
  uiHint: OnboardingUIHint
  quickReplies?: string[]
  skipLabel?: string
}

const LOCAL_STEPS: LocalStep[] = [
  {
    text: 'Oi! Sou o assistente do AM Finance 👋\n\nVou te fazer **3 perguntas rápidas** pra montar seu planejamento financeiro personalizado.\n\nQual é seu **foco financeiro** agora?',
    uiHint: 'QUICK_REPLIES',
    quickReplies: ['Controlar gastos', 'Quitar dívidas', 'Economizar mais', 'Investir'],
  },
  {
    text: 'Ótimo! Agora me conta: **quanto você recebe por mês?** (salário + qualquer extra)',
    uiHint: 'FREE_TEXT',
  },
  {
    text: 'Quais são seus **gastos fixos mensais**? Seleciona todos que você tem:',
    uiHint: 'EXPENSE_PICKER',
  },
  {
    text: 'Tem algo mais que eu deva saber? Dívidas, objetivos específicos, situação especial... **Quanto mais você contar, mais personalizado fica seu planejamento.** Mas pode pular se preferir!',
    uiHint: 'FREE_TEXT',
    skipLabel: 'Pular essa etapa →',
  },
]

// ─── Utilities ─────────────────────────────────────────────────────────────────

export function stripUITags(content: string): string {
  return content.replace(/\[UI:[^\]]+\]/g, '').trim()
}

export function stripCategoriesBlock(content: string): string {
  return content.replace(/```json:categories\s*\n[\s\S]*?```/g, '').trim()
}

function parseOnboardingData(content: string): ParsedOnboardingData | null {
  const match = content.match(/```json:categories\s*\n([\s\S]*?)```/)
  if (!match) return null

  try {
    const parsed = JSON.parse(match[1])

    if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
      let validCategories: OnboardingCategory[] = parsed.categories.filter(
        (c: OnboardingCategory) => c.name && c.type,
      )
      if (validCategories.length === 0) return null

      const parsedIncome =
        typeof parsed.income === 'number' && parsed.income > 0 ? parsed.income : undefined

      // Safety net: if total exceeds income, scale down proportionally
      if (parsedIncome) {
        const total = validCategories.reduce((sum, c) => sum + (c.amount || 0), 0)
        if (total > parsedIncome) {
          const scale = parsedIncome / total
          validCategories = validCategories.map((c) => ({
            ...c,
            amount: Math.round(c.amount * scale),
          }))
          // Fix rounding drift: adjust last category so sum equals income exactly
          const roundedTotal = validCategories.reduce((sum, c) => sum + c.amount, 0)
          validCategories[validCategories.length - 1].amount += parsedIncome - roundedTotal
        }
      }

      return {
        categories: validCategories,
        financeOrganization: parsed.financeOrganization,
        income: parsedIncome,
      }
    }

    // Legacy: plain array
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name && parsed[0].type) {
      return { categories: parsed }
    }
  } catch {
    // ignore
  }
  return null
}

/** Simulates streaming effect for a local text string */
async function simulateStream(
  text: string,
  onChunk: (chunk: string) => void,
  chunkSize = 3,
  delayMs = 18,
): Promise<void> {
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize)
    onChunk(chunk)
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}

async function streamFromEndpoint(
  message: string,
  history: Array<{ role: string; content: string }>,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const baseURL = api.defaults.baseURL?.replace(/\/$/, '') || ''
  const response = await fetch(`${baseURL}/api/onboarding/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message, history }),
  })

  if (!response.ok) throw new Error('Failed to send message')

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let fullContent = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      fullContent += chunk
      onChunk(chunk)
    }
  } finally {
    reader.releaseLock()
  }

  return fullContent
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useOnboardingChat() {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<OnboardingMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [suggestedCategories, setSuggestedCategories] = useState<OnboardingCategory[] | null>(null)
  const [financeOrganization, setFinanceOrganization] =
    useState<OnboardingFinanceOrganization | null>(null)
  const [income, setIncome] = useState<number | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isGeneratingCategories, setIsGeneratingCategories] = useState(false)
  const [activeUIHint, setActiveUIHint] = useState<OnboardingUIHint>(null)
  const [activeQuickReplies, setActiveQuickReplies] = useState<string[]>([])
  const [activeSkipLabel, setActiveSkipLabel] = useState<string | null>(null)

  // Tracks which local step we are on (0, 1, 2) or -1 when in AI mode
  const stepRef = useRef(0)
  const hasInitialized = useRef(false)
  const msgIdCounter = useRef(0)

  const nextMsgId = useCallback(() => {
    msgIdCounter.current += 1
    return `msg-${msgIdCounter.current}`
  }, [])

  // ── Helper: add an assistant message with simulated streaming ────────────────
  const playLocalStep = useCallback(
    async (step: LocalStep) => {
      setIsLoading(true)
      setIsStreaming(true)
      setActiveUIHint(null)
      setActiveQuickReplies([])

      const msgId = nextMsgId()
      setMessages((prev) => [
        ...prev,
        { id: msgId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
      ])

      await simulateStream(step.text, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: m.content + chunk } : m)),
        )
      })

      // Finalise message metadata
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, uiHint: step.uiHint, quickReplies: step.quickReplies } : m,
        ),
      )

      setActiveUIHint(step.uiHint)
      setActiveQuickReplies(step.quickReplies ?? [])
      setActiveSkipLabel(step.skipLabel ?? null)
      setIsStreaming(false)
      setIsLoading(false)
    },
    [nextMsgId],
  )

  // ── Initialise: play first local step ────────────────────────────────────────
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    playLocalStep(LOCAL_STEPS[0])
  }, [playLocalStep])

  // ── Handle user message ───────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isLoading || isStreaming) return

      const currentStep = stepRef.current

      // Add user bubble
      const userMsg: OnboardingMessage = {
        id: nextMsgId(),
        role: 'user',
        content: userText.trim(),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])

      if (currentStep < LOCAL_STEPS.length - 1) {
        // ── Still in local steps: advance and play next ──────────────────────
        const nextStep = currentStep + 1
        stepRef.current = nextStep
        await playLocalStep(LOCAL_STEPS[nextStep])
      } else {
        // ── All local steps done: call the AI with all collected context ─────
        stepRef.current = LOCAL_STEPS.length // mark as AI mode

        setIsLoading(true)
        setIsStreaming(true)
        setActiveUIHint(null)
        setActiveQuickReplies([])
        setActiveSkipLabel(null)

        const aiMsgId = nextMsgId()
        setMessages((prev) => [
          ...prev,
          { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
        ])

        try {
          // Build history from all messages including this user message
          const history = [...messages, userMsg]
            .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content.trim()))
            .map((m) => ({ role: m.role, content: m.content }))

          let fullContent = ''
          let accumulated = ''
          fullContent = await streamFromEndpoint(userText.trim(), history, (chunk) => {
            accumulated += chunk
            const jsonBlockStart = accumulated.indexOf('```json:categories')
            if (jsonBlockStart !== -1) {
              setIsGeneratingCategories(true)
              const displayContent = stripUITags(accumulated.slice(0, jsonBlockStart).trim())
              setMessages((prev) =>
                prev.map((m) => (m.id === aiMsgId ? { ...m, content: displayContent } : m)),
              )
            } else {
              setMessages((prev) =>
                prev.map((m) => (m.id === aiMsgId ? { ...m, content: m.content + chunk } : m)),
              )
            }
          })
          setIsGeneratingCategories(false)

          const parsed = parseOnboardingData(fullContent)
          if (parsed) {
            setSuggestedCategories(parsed.categories)
            if (parsed.financeOrganization) setFinanceOrganization(parsed.financeOrganization)
            if (parsed.income) setIncome(parsed.income)
          }

          // Strip UI tags and categories block from displayed message
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: stripUITags(stripCategoriesBlock(m.content)) }
                : m,
            ),
          )

          setActiveUIHint(parsed ? 'NONE' : null)
        } catch (error) {
          console.error('Onboarding AI error:', error)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: 'Desculpe, ocorreu um erro. Tente novamente.' }
                : m,
            ),
          )
          setActiveUIHint(null)
        } finally {
          setIsStreaming(false)
          setIsLoading(false)
        }
      }
    },
    [isLoading, isStreaming, messages, playLocalStep, nextMsgId],
  )

  // ── Confirm categories ────────────────────────────────────────────────────────
  const confirmCategories = useCallback(
    async (categories: OnboardingCategory[]) => {
      if (isCompleting) return
      setIsCompleting(true)
      try {
        await api.post('/api/onboarding/complete', {
          categories,
          financeOrganization: financeOrganization ?? undefined,
          income: income ?? undefined,
        })
        queryClient.setQueryData(['onboarding', 'status'], { completed: true })
        setIsCompleted(true)
      } catch (error) {
        console.error('Error completing onboarding:', error)
        throw error
      } finally {
        setIsCompleting(false)
      }
    },
    [isCompleting, financeOrganization, income, queryClient],
  )

  const removeCategory = useCallback((index: number) => {
    setSuggestedCategories((prev) => prev?.filter((_, i) => i !== index) ?? prev)
  }, [])

  const updateCategoryType = useCallback(
    (index: number, type: 'ESSENTIAL' | 'LEISURE' | 'INVESTMENT') => {
      setSuggestedCategories(
        (prev) => prev?.map((cat, i) => (i === index ? { ...cat, type } : cat)) ?? prev,
      )
    },
    [],
  )

  const updateCategoryAmount = useCallback((index: number, amount: number) => {
    setSuggestedCategories(
      (prev) => prev?.map((cat, i) => (i === index ? { ...cat, amount } : cat)) ?? prev,
    )
  }, [])

  const addCategory = useCallback((name: string, type: 'ESSENTIAL' | 'LEISURE' | 'INVESTMENT') => {
    setSuggestedCategories((prev) => {
      const newCat: OnboardingCategory = { name, type, amount: 0 }
      return prev ? [...prev, newCat] : [newCat]
    })
  }, [])

  // Derive financeOrganization from actual category amounts grouped by type
  let derivedFinanceOrganization = financeOrganization
  if (suggestedCategories && income && income > 0) {
    const sums = { ESSENTIAL: 0, LEISURE: 0, INVESTMENT: 0 }
    suggestedCategories.forEach((cat) => {
      if (cat.amount > 0) sums[cat.type] += cat.amount
    })
    const total = sums.ESSENTIAL + sums.LEISURE + sums.INVESTMENT
    if (total > 0) {
      derivedFinanceOrganization = {
        essential: Math.round((sums.ESSENTIAL / income) * 100),
        leisure: Math.round((sums.LEISURE / income) * 100),
        investment: Math.round((sums.INVESTMENT / income) * 100),
      }
    }
  }

  return {
    messages,
    isLoading,
    isStreaming,
    suggestedCategories,
    financeOrganization: derivedFinanceOrganization,
    income,
    isCompleting,
    isCompleted,
    isGeneratingCategories,
    activeUIHint,
    activeQuickReplies,
    activeSkipLabel,
    sendMessage,
    confirmCategories,
    removeCategory,
    updateCategoryType,
    updateCategoryAmount,
    addCategory,
  }
}
