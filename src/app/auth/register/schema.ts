import { z } from 'zod'
import type { TFunction } from 'i18next'

/**
 * Matches the sign-up artboard: name, e-mail, password and belt.
 *
 * No password confirmation field — the design does not have one, and the
 * password input already offers a reveal toggle, which is what confirmation was
 * standing in for.
 */
export const createRegisterSchema = (t: TFunction<['guarda', 'auth'], undefined>) =>
  z.object({
    username: z.string().trim().min(1, t('auth:NAME_REQUIRED')),
    email: z.string().min(1, t('auth:EMAIL_REQUIRED')).email(t('auth:EMAIL_INVALID')),
    password: z.string().min(8, t('AUTH_PASSWORD_HINT')),
    belt: z.enum(['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']),
  })

export type RegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>
