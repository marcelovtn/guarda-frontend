'use client'

import { useTranslation } from 'react-i18next'
import { useUpdateUserLanguage } from './LanguageSelector.slice'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { useGetUserInfo } from '@/lib/userInfo/userInfo.slice'

export function LanguageSelector() {
  const { t, i18n } = useTranslation('settings')

  const { mutateAsync: updateUserLanguage } = useUpdateUserLanguage()
  const [value, setValue] = useState<'pt' | 'en' | 'es'>(i18n.language as 'pt' | 'en' | 'es')
  const { data: userInfo } = useGetUserInfo()

  useEffect(() => {
    if (userInfo) {
      setValue(userInfo.data.language as 'pt' | 'en' | 'es')
    }
  }, [userInfo])

  const setLocale = (locale: 'pt' | 'en' | 'es') => {
    setValue(locale)
    try {
      localStorage.setItem('language', locale)
      document?.documentElement?.setAttribute('lang', locale)
      // sync cookie used by SSR and middleware
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
    Promise.allSettled([i18n.changeLanguage(locale), updateUserLanguage(locale)])
  }

  const current = value

  return (
    <Select value={current} onValueChange={(val) => setLocale(val as 'pt' | 'en' | 'es')}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t('LANGUAGE_SELECT_LABEL')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="pt">{t('LANG_PORTUGUESE_BRAZIL')}</SelectItem>
          <SelectItem value="en">{t('LANG_ENGLISH')}</SelectItem>
          <SelectItem value="es">{t('LANG_SPANISH')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
