import { z } from 'zod'
import type { TFunction } from 'i18next'

export const createForgotPasswordSchema = (t: TFunction<'auth', undefined>) =>
  z.object({
    email: z.string().min(1, t('EMAIL_REQUIRED')).email(t('EMAIL_INVALID')),
  })

export type ForgotPasswordSchema = z.infer<ReturnType<typeof createForgotPasswordSchema>>
