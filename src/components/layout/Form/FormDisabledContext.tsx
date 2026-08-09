'use client'

import { createContext, useContext } from 'react'

const FormDisabledContext = createContext(false)

export function useFormDisabled() {
  return useContext(FormDisabledContext)
}

export function FormDisabledProvider({
  disabled,
  children,
}: {
  disabled: boolean
  children: React.ReactNode
}) {
  return <FormDisabledContext.Provider value={disabled}>{children}</FormDisabledContext.Provider>
}
