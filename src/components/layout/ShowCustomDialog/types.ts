import { ReactNode } from 'react'

export interface ShowCustomDialogProps {
  title: string
  subtitle: string
  body: ReactNode
  isOpen: boolean
  isFullHigh: boolean
  onOpenChange: (open: boolean) => void
}
