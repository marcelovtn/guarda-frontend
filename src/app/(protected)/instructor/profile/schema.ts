import { z } from 'zod'

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, 'O nome não pode ficar vazio'),
  bio: z.string().trim().max(400, 'Máximo de 400 caracteres').optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>
