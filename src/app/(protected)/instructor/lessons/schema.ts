import { z } from 'zod'

/** Shared by the new-lesson and edit-lesson screens — same fields, same rules. */
export const lessonFormSchema = z.object({
  title: z.string().trim().min(1, 'Dê um título para a aula'),
  description: z.string().trim().max(600).optional(),
  trackId: z.string(),
  /** Empty means the lesson stays out of any track — a first-class state. */
  moduleId: z.string().optional(),
})

export type LessonFormValues = z.infer<typeof lessonFormSchema>

/** Sentinel for "not in a track": a Select cannot hold an empty value. */
export const NO_TRACK = 'none'
