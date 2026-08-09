import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { ShowDialogProps } from './types'

export function ButtonShowDialog({
  buttonText,
  title,
  description,
  buttonSubmit = 'Continuar',
  buttonCancel = 'Cancelar',
  isFullHigh,
  body,
  onClickSubmit,
}: ShowDialogProps) {
  const isMobile = useIsMobile()
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <RemoveButton buttonText={buttonText} />
      </AlertDialogTrigger>
      <AlertDialogContent
        className={`flex flex-col transition-all duration-300 ease-in-out ${isMobile && isFullHigh ? 'max-w-[100dvw h-[100dvh] w-[100dvw]' : 'w-full max-w-lg'} `}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className={`${isFullHigh ? 'h-[calc(95dvh-7rem)]' : ''}`}>{body}</div>
        <AlertDialogFooter>
          <AlertDialogCancel>{buttonCancel}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onClickSubmit}
          >
            {buttonSubmit}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RemoveButton({ buttonText }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonText}</TooltipTrigger>
        <TooltipContent className="bg-muted text-white">
          <p>Excluir</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
