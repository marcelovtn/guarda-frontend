import { areAllRequirementsMet, getPasswordRequirements } from '@/utils/regexUtils'
import { z } from 'zod'
import type { TFunction } from 'i18next'

export const createResetPasswordSchema = (t: TFunction<'auth', undefined>) =>
  z
    .object({
      password: z.string().refine(
        (val) => {
          const requirements = getPasswordRequirements(val)
          return areAllRequirementsMet(requirements)
        },
        { message: t('PASSWORD_WEAK') },
      ),
      confirmPassword: z.string().min(1, t('CONFIRM_PASSWORD_REQUIRED')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('PASSWORDS_MUST_MATCH'),
      path: ['confirmPassword'],
    })

export type ResetPasswordSchema = z.infer<ReturnType<typeof createResetPasswordSchema>>
