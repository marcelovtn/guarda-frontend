import { z } from 'zod'

export const accountSchema = z.object({
  name: z.string().trim().min(1, 'O nome não pode ficar vazio'),
  email: z.string().email(),
})

export type AccountValues = z.infer<typeof accountSchema>
