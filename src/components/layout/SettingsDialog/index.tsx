'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import { useDeleteAccount } from '@/lib/userData/userData.slice'
import { publicRoutes } from '@/utils/routes'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SettingsDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SettingsDialog({ open, setOpen }: SettingsDialogProps) {
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()
  const { t } = useTranslation('settings')

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`fixed left-[50%] top-[50%] z-50 translate-x-[-50%] transition-all duration-300 ease-in-out ${
            isMobile ? 'h-[100dvh] w-[100dvw] max-w-[100dvw]' : 'w-full max-w-lg'
          }`}
        >
          <DialogHeader>
            <DialogTitle>{t('PAGE_TITLE')}</DialogTitle>
            <DialogDescription className="my-2 text-left">{t('PAGE_SUBTITLE')}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">{t('THEME_TITLE')}</label>
                <Select defaultValue={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t('THEME_SELECT_PLACEHOLDER')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="system">{t('THEME_SYSTEM')}</SelectItem>
                      <SelectItem value="dark">{t('THEME_DARK')}</SelectItem>
                      <SelectItem value="light">{t('THEME_LIGHT')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-red-500">
                {t('DELETE_ACCOUNT_SECTION_TITLE')}
              </label>
              <Button variant="destructive" size="sm" onClick={() => setDeleteAccountOpen(true)}>
                {t('DELETE_ACCOUNT_BUTTON')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteAccountDialog open={deleteAccountOpen} setOpen={setDeleteAccountOpen} />
    </>
  )
}

interface DeleteAccountDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

function DeleteAccountDialog({ open, setOpen }: DeleteAccountDialogProps) {
  const [confirmationText, setConfirmationText] = useState('')
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount()
  const router = useRouter()
  const { t } = useTranslation('settings')
  const expectedText = t('DELETE_ACCOUNT_CONFIRM_PHRASE')

  const handleDeleteAccount = async () => {
    try {
      const response: any = await deleteAccount()
      const successMessage =
        response?.message ||
        response?.data?.message ||
        response?.data?.data?.message ||
        t('DELETE_SUCCESS_DEFAULT')
      toast.success(successMessage)
      router.push(publicRoutes.LOGIN)
    } catch (error) {
      console.error(error)
      toast.error(t('DELETE_ERROR_UNEXPECTED'))
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(false)
          setConfirmationText('')
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">{t('DELETE_ACCOUNT_BUTTON')}</DialogTitle>
          <DialogDescription>Esta ação é irreversível.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
          </p>
          <Input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full"
            placeholder={`Digite "${expectedText}"`}
            autoComplete="off"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={confirmationText.toLowerCase() !== expectedText || isPending}
          >
            {isPending ? 'Excluindo...' : 'Excluir Conta'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
