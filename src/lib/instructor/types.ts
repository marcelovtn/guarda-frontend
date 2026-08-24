/** Mirrors the DTOs in the backend's instructor module. */

export type TrackCategory =
  | 'GUARD'
  | 'PASSING'
  | 'CONTROL'
  | 'SUBMISSIONS'
  | 'ESCAPES'
  | 'TAKEDOWNS'

export type TrackLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type PublishStatus = 'DRAFT' | 'PUBLISHED'

export interface InstructorStats {
  lessonCount: number
  trackCount: number
  lastPublishedAt: string | null
}

export interface PublicInstructor {
  id: string
  slug: string
  displayName: string
  bio: string | null
  /** Endereço pronto para o `<img>`. Null quando não há foto. */
  photoUrl: string | null
  /** Cents. */
  monthlyPrice: number
  stats: InstructorStats
}

export interface InstructorProfile extends PublicInstructor {
  published: boolean
}

export interface UpdateInstructorProfilePayload {
  displayName?: string
  bio?: string | null
  photoKey?: string | null
  monthlyPrice?: number
  published?: boolean
}

export interface InstructorStudent {
  id: string
  name: string
  email: string
  subscribedAt: string
  lessonsCompleted: number
  lastActivityAt: string | null
}
