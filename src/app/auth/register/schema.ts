import { areAllRequirementsMet, getPasswordRequirements } from '@/utils/regexUtils'
import { z } from 'zod'
import type { TFunction } from 'i18next'

export const createRegisterSchema = (t: TFunction<'auth', undefined>) =>
  z
    .object({
      username: z.string().min(1, t('NAME_REQUIRED')),
      email: z.string().min(1, t('EMAIL_REQUIRED')).email(t('EMAIL_INVALID')),
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

export type RegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>
