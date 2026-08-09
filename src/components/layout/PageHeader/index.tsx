import React from 'react'
import { type LucideIcon } from 'lucide-react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  Icon?: LucideIcon
  iconBgFrom?: string
  iconBgTo?: string
  iconClassName?: string
  className?: string
  right?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  Icon,
  iconBgFrom = 'from-primary/20',
  iconBgTo = 'to-primary/10',
  iconClassName = 'text-primary',
  className = '',
  right,
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          {Icon ? (
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconBgFrom} ${iconBgTo}`}
            >
              <Icon className={`h-6 w-6 ${iconClassName}`} />
            </div>
          ) : null}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        {right ? <div className="w-full shrink-0 sm:w-auto">{right}</div> : null}
      </div>
    </div>
  )
}
