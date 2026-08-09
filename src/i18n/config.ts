export const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'pt'
export const LOCALE_COOKIE = 'NEXT_LOCALE'
