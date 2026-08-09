/**
 * Formatters for lesson durations and publication dates.
 *
 * The output strings are the ones the design uses literally — "18:32",
 * "4h 12min", "há 2 dias" — so they live in one place instead of being
 * re-derived per screen.
 */

/** Player and lesson rows: "18:32", or "1:02:11" past an hour. */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = seconds % 60

  const pad = (value: number) => String(value).padStart(2, '0')

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`
}

/** Track totals: "4h 12min", "45min". */
export function formatTotalDuration(totalSeconds: number): string {
  const minutes = Math.round(Math.max(0, totalSeconds) / 60)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return `${rest}min`
  return rest === 0 ? `${hours}h` : `${hours}h ${String(rest).padStart(2, '0')}min`
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 86_400],
  ['month', 30 * 86_400],
  ['day', 86_400],
  ['hour', 3600],
  ['minute', 60],
]

/**
 * Relative publication date: "há 20 horas", "há 2 dias", "há 3 meses".
 *
 * Goes through Intl rather than hand-written strings, so pluralisation and
 * wording come from the locale instead of being hardcoded in Portuguese.
 * Deliberately coarse — the design never shows an exact timestamp, and "há 2
 * dias" reads better than a date the student has to subtract in their head.
 */
export function formatRelativeDate(value: Date | string | null, locale = 'pt-BR'): string {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value
  const elapsedSec = Math.round((Date.now() - date.getTime()) / 1000)
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    const amount = Math.floor(elapsedSec / secondsInUnit)
    if (amount >= 1) return formatter.format(-amount, unit)
  }

  return formatter.format(0, 'minute')
}

/** Prices are stored in cents to avoid float rounding. */
export function formatPriceFromCents(cents: number, locale = 'pt-BR'): string {
  return (cents / 100).toLocaleString(locale, {
    style: 'currency',
    currency: 'BRL',
  })
}
