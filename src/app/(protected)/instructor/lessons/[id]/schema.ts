import { z } from 'zod'

export const editLessonSchema = z.object({
  title: z.string().trim().min(1, 'Dê um título para a aula'),
  description: z.string().trim().max(600).optional(),
  trackId: z.string(),
  /** Empty means the lesson stays out of any track — a first-class state. */
  moduleId: z.string().optional(),
})

export type EditLessonValues = z.infer<typeof editLessonSchema>
