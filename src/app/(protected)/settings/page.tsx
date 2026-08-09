'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Palette, Settings, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from './components/LanguageSelector/LanguageSelector'
import { ThemeSelector } from './components/ThemeSelector'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDeleteAccount } from '@/lib/userData/userData.slice'
import { publicRoutes } from '@/utils/routes'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function SettingsPage() {
  const { t } = useTranslation('settings')
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  return (
    <div className="mx-auto mb-8 max-w-6xl flex-col px-3 pt-6 sm:px-4">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('PAGE_TITLE')}</h1>
            <p className="text-muted-foreground">{t('PAGE_SUBTITLE')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-lg">{t('CARD_APPEARANCE_TITLE')}</div>
                <CardDescription className="mt-1">{t('CARD_APPEARANCE_DESC')}</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{t('THEME_TITLE')}</h3>
                  <p className="text-sm text-muted-foreground">{t('THEME_DESC')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <ThemeSelector />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{t('LANG_TITLE')}</h3>
                  <p className="text-sm text-muted-foreground">{t('LANG_DESC')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg">{t('CARD_ACCOUNT_TITLE')}</div>
                <CardDescription className="mt-1">{t('CARD_ACCOUNT_DESC')}</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-red-500">
                {t('DELETE_ACCOUNT_SECTION_TITLE')}
              </label>
              <Button variant="destructive" size="sm" onClick={() => setDeleteAccountOpen(true)}>
                {t('DELETE_ACCOUNT_BUTTON')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteAccountDialog open={deleteAccountOpen} setOpen={setDeleteAccountOpen} />
    </div>
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
          <DialogDescription>
            {t('DELETE_ACCOUNT_CONFIRM_PHRASE', { defaultValue: 'Esta ação é irreversível.' })}
          </DialogDescription>
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
