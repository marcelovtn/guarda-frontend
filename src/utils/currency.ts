import i18n from 'i18next'

export type AppCurrency =
  | 'BRL' // Real Brasileiro
  | 'USD' // Dólar Americano
  | 'EUR' // Euro
  | 'MXN' // Peso Mexicano
  | 'GBP' // Libra Esterlina
  | 'CHF' // Franco Suíço
  | 'RUB' // Rublo Russo
  | 'JPY' // Iene Japonês
  | 'CNY' // Yuan Chinês
  | 'KRW' // Won Coreano
  | 'SGD' // Dólar de Singapura
  | 'INR' // Rupia Indiana
  | 'AUD' // Dólar Australiano
  | 'NZD' // Dólar Neozelandês
  | 'ZAR' // Rand Sul-Africano

const VALID_CURRENCIES: AppCurrency[] = [
  'BRL',
  'USD',
  'EUR',
  'MXN',
  'GBP',
  'CHF',
  'RUB',
  'JPY',
  'CNY',
  'KRW',
  'SGD',
  'INR',
  'AUD',
  'NZD',
  'ZAR',
]

export function getPreferredCurrency(): AppCurrency {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('currency') as AppCurrency | null
      if (stored && VALID_CURRENCIES.includes(stored)) return stored
    } catch {}
  }
  const langRaw = (i18n.language || 'pt').toLowerCase()
  const base = langRaw.split('-')[0]
  if (base === 'en') return 'USD'
  if (base === 'es') return 'EUR'
  return 'BRL'
}

export function getLocaleForCurrency(currency: AppCurrency): string {
  const map: Record<AppCurrency, string> = {
    BRL: 'pt-BR', // Brasil
    USD: 'en-US', // Estados Unidos
    EUR: 'de-DE', // Europa (Alemanha - formato padrão para Euro)
    MXN: 'es-MX', // México
    GBP: 'en-GB', // Reino Unido
    CHF: 'de-CH', // Suíça
    RUB: 'ru-RU', // Rússia
    JPY: 'ja-JP', // Japão
    CNY: 'zh-CN', // China
    KRW: 'ko-KR', // Coreia do Sul
    SGD: 'en-SG', // Singapura
    INR: 'en-IN', // Índia
    AUD: 'en-AU', // Austrália
    NZD: 'en-NZ', // Nova Zelândia
    ZAR: 'en-ZA', // África do Sul
  }
  return map[currency] || 'en-US'
}

export function getCurrencySettings(): { locale: string; currency: AppCurrency } {
  const currency = getPreferredCurrency()
  const locale = getLocaleForCurrency(currency)
  return { locale, currency }
}

export function getCurrencySymbol(input?: AppCurrency): string {
  const { currency, locale } = input
    ? { currency: input, locale: getLocaleForCurrency(input) }
    : getCurrencySettings()

  try {
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(0)
    const symbol = parts.find((p) => p.type === 'currency')?.value
    if (symbol) return symbol
  } catch {
    // Fallback se o locale não for suportado
  }

  // Fallback manual para cada moeda
  const symbolMap: Record<AppCurrency, string> = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
    MXN: '$',
    GBP: '£',
    CHF: 'CHF',
    RUB: '₽',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    SGD: 'S$',
    INR: '₹',
    AUD: 'A$',
    NZD: 'NZ$',
    ZAR: 'R',
  }
  return symbolMap[currency] || currency
}

export function formatCurrency(value: number, onlyDecimal: boolean = false): string {
  const { locale, currency } = getCurrencySettings()
  return new Intl.NumberFormat(locale, {
    style: onlyDecimal ? 'decimal' : 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: onlyDecimal ? undefined : 2,
    maximumFractionDigits: onlyDecimal ? undefined : 2,
  } as any).format(value || 0)
}
