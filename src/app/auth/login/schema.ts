import { z } from 'zod'
import type { TFunction } from 'i18next'

export const createLoginSchema = (t: TFunction<'auth', undefined>) =>
  z.object({
    email: z.string().min(1, t('EMAIL_REQUIRED')).email(t('EMAIL_INVALID')),
    password: z.string().min(1, t('PASSWORD_REQUIRED')),
  })

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>
