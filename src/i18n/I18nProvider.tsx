'use client'

import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { initI18n } from './init'

export function I18nProvider({ children }: { children: ReactNode }) {
  const i18n = initI18n()
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
