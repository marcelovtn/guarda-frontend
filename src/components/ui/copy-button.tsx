'use client'

import { Copy } from 'lucide-react'

interface CopyButtonProps {
  text: string
  title: string
  className?: string
}

export function CopyButton({ text, title, className = '' }: CopyButtonProps) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className={`flex h-6 w-6 items-center justify-center rounded-md border border-border/40 bg-background/50 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground ${className}`}
      title={title}
    >
      <Copy className="h-3 w-3" />
    </button>
  )
}
