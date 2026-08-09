import i18n from 'i18next'

export function formatMonth(date: Date) {
  const lang = i18n.language || 'pt'
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES'
  return date.toLocaleDateString(locale, { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase())
}
