import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { ShowCustomDialogProps } from './types'

export function ShowCustomDialog({
  title,
  subtitle,
  body,
  isOpen,
  isFullHigh,
  onOpenChange,
}: ShowCustomDialogProps) {
  const isMobile = useIsMobile()
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col transition-all duration-300 ease-in-out ${isMobile && isFullHigh ? 'max-w-[100dvw h-[100dvh] w-[100dvw]' : 'w-full max-w-lg'} `}
      >
        <DialogHeader className="flex flex-col items-start text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <div className={`${isFullHigh ? 'h-[calc(95dvh-7rem)]' : ''}`}>{body}</div>
      </DialogContent>
    </Dialog>
  )
}
