const BILLING_CLOSE_DAY_KEY = 'billing_close_day'

/** Retorna o dia de fechamento configurado, ou null se a feature estiver desabilitada. */
export function getBillingCloseDay(): number | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(BILLING_CLOSE_DAY_KEY)
  if (stored === 'disabled' || stored === null) return null
  const parsed = parseInt(stored, 10)
  if (isNaN(parsed) || parsed < 1 || parsed > 28) return null
  return parsed
}

export function setBillingCloseDayCache(day: number | null): void {
  if (day === null) {
    localStorage.setItem(BILLING_CLOSE_DAY_KEY, 'disabled')
  } else {
    localStorage.setItem(BILLING_CLOSE_DAY_KEY, day.toString())
  }
}

/**
 * Retorna o período de billing ao qual uma data pertence.
 * Se closingDay for null (feature desabilitada), retorna o mês calendário da data.
 *
 * Convenção: closingDay é o ÚLTIMO dia do período.
 * Ex: fechamento dia 20 → "Abril" = 21/Mar a 20/Abr
 */
export function getBillingPeriodForDate(
  date: Date,
  closingDay: number | null,
): { month: number; year: number } {
  const dateMonth = date.getMonth() + 1
  const dateYear = date.getFullYear()

  if (closingDay === null) {
    return { month: dateMonth, year: dateYear }
  }

  const dateDay = date.getDate()
  if (dateDay > closingDay) {
    if (dateMonth === 12) return { month: 1, year: dateYear + 1 }
    return { month: dateMonth + 1, year: dateYear }
  }
  return { month: dateMonth, year: dateYear }
}

/**
 * Retorna o intervalo de datas de um período de billing.
 * Se closingDay for null, retorna o mês calendário completo.
 *
 * Com closingDay: período "mês M" = dia (D+1) do mês M-1 até dia D do mês M.
 * Ex: "Abril" com fechamento dia 20 → 21/Mar a 20/Abr
 */
export function getBillingCycleDateRange(
  month: number,
  year: number,
  closingDay: number | null,
): { start: Date; end: Date } {
  if (closingDay === null) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0) // último dia do mês
    return { start, end }
  }

  const end = new Date(year, month - 1, closingDay)
  const start = new Date(year, month - 2, closingDay + 1)
  return { start, end }
}

/**
 * Retorna o período de billing atual com base em hoje.
 * Se closingDay for null, retorna o mês calendário atual.
 */
export function getCurrentBillingPeriod(closingDay?: number | null): {
  month: number
  year: number
} {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const day = closingDay !== undefined ? closingDay : getBillingCloseDay()

  if (day === null) {
    return { month: currentMonth, year: currentYear }
  }

  const currentDay = today.getDate()
  if (currentDay > day) {
    if (currentMonth === 12) return { month: 1, year: currentYear + 1 }
    return { month: currentMonth + 1, year: currentYear }
  }

  return { month: currentMonth, year: currentYear }
}
