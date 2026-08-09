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

interface ShowDialogProps {
  buttonText: any
  title: string
  description: string
  buttonSubmit?: string
  buttonCancel?: string
  onClickSubmit: () => void
}

export function ShowDialog({
  buttonText,
  title,
  description,
  buttonSubmit = 'Continuar',
  buttonCancel = 'Cancelar',
  onClickSubmit,
}: ShowDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <RemoveButton buttonText={buttonText} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
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
