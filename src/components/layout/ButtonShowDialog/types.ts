import { ReactNode } from 'react'

export interface ShowDialogProps {
  buttonText: any
  title: string
  description: string
  buttonSubmit?: string
  buttonCancel?: string
  body?: ReactNode
  isFullHigh?: boolean
  onClickSubmit: () => void
}
