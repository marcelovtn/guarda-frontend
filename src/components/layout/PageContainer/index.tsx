import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Page gutter for every GUARDA screen.
 *
 * Matches the artboards: 64px inline padding at desktop, narrowing on smaller
 * viewports, with the content capped so a wide monitor does not stretch a row
 * of cards into something unreadable.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] px-5 py-8 md:px-8 xl:px-16', className)}>
      {children}
    </div>
  )
}
