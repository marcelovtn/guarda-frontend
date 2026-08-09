import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'

interface CardIntroductionProps {
  title: ReactNode
  description: string
  icon: ReactNode
  className?: string
}

export function CardIntroduction({ description, icon, title, className }: CardIntroductionProps) {
  return (
    <Card
      className={`group overflow-hidden transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 ${className}`}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold group-hover:text-violet-500">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
