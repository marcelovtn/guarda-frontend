'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation('settings')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  const themes = [
    { value: 'light', label: t('THEME_LIGHT'), icon: Sun },
    { value: 'dark', label: t('THEME_DARK'), icon: Moon },
    { value: 'system', label: t('THEME_SYSTEM'), icon: Monitor },
  ]

  return (
    <div className="flex items-center gap-2">
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              return (
                <SelectItem
                  key={themeOption.value}
                  value={themeOption.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {themeOption.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
