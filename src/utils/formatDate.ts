import { format } from 'date-fns'
import { enUS, ptBR, es } from 'date-fns/locale'
import type { Locale } from 'date-fns'

export type SupportedLocale = 'en' | 'pt' | 'es'

const localeMap: Record<string, Locale> = {
  en: enUS,
  pt: ptBR,
  es,
}

export function resolveLocale(lang?: string): Locale {
  if (!lang) return ptBR
  const base = lang.split('-')[0]
  return localeMap[base] || ptBR
}

export function formatMonthYearLabel(date: Date, langOverride?: string) {
  const lang =
    langOverride || (typeof window !== 'undefined' ? localStorage.getItem('language') : '') || 'en'
  const locale = resolveLocale(lang)
  return `${format(date, 'LLLL', { locale })} - ${format(date, 'yyyy', { locale })}`
}

/** Formato curto para eixo de gráfico: "mar '26" */
export function formatShortMonthYear(date: Date, langOverride?: string) {
  const lang =
    langOverride || (typeof window !== 'undefined' ? localStorage.getItem('language') : '') || 'en'
  const locale = resolveLocale(lang)
  return format(date, 'MMM/YYY', { locale }).replace(/\./g, '')
}

export function formatDay(date?: string | Date, langOverride?: string) {
  if (!date) return '-'
  const lang =
    langOverride || (typeof window !== 'undefined' ? localStorage.getItem('language') : '') || 'en'
  const d = typeof date === 'string' ? new Date(date) : date
  const locale = resolveLocale(lang)
  return format(d, 'PPP', { locale })
}

export function formatTime(date?: string | Date, langOverride?: string) {
  const lang =
    langOverride || (typeof window !== 'undefined' ? localStorage.getItem('language') : '') || 'en'
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  const locale = resolveLocale(lang)
  return format(d, 'HH:mm', { locale })
}

export function formatDate(date: string, langOverride?: string) {
  const lang =
    langOverride || (typeof window !== 'undefined' ? localStorage.getItem('language') : '') || 'en'
  const locale = resolveLocale(lang)
  return format(new Date(date), 'PPP', { locale })
}
