import 'server-only'
import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES, type AppLocale } from './config'

export async function getServerLocale(): Promise<AppLocale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as AppLocale | undefined
  const locale: AppLocale = SUPPORTED_LOCALES.includes((cookieLocale as AppLocale) || 'pt')
    ? (cookieLocale as AppLocale)
    : DEFAULT_LOCALE
  return locale
}
