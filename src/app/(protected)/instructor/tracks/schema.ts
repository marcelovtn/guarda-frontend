import { z } from 'zod'

export const newTrackSchema = z.object({
  title: z.string().trim().min(1, 'Dê um nome para a trilha'),
  description: z.string().trim().max(500).optional(),
  category: z.enum(['GUARD', 'PASSING', 'CONTROL', 'SUBMISSIONS', 'ESCAPES', 'TAKEDOWNS']),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
})

export type NewTrackValues = z.infer<typeof newTrackSchema>
