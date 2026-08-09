import type { TrackCategory, TrackLevel } from '@/lib/instructor/types'

export interface TrackProgress {
  completedCount: number
  totalCount: number
  percent: number
  nextLessonId: string | null
}

export interface TrackSummary {
  id: string
  slug: string
  title: string
  description: string | null
  category: TrackCategory
  level: TrackLevel
  lessonCount: number
  totalDurationSec: number
  /**
   * First lesson in track order. Lets a card send the student straight into the
   * video instead of one more page listing what they already chose.
   */
  firstLessonId: string | null
  progress: TrackProgress | null
}

export interface TrackLesson {
  id: string
  title: string
  durationSec: number
  position: number
  /** Index across the whole track — what the UI numbers by. */
  trackPosition: number
  completed: boolean
  lastPositionSec: number
}

export interface TrackModule {
  id: string
  title: string
  position: number
  lessonCount: number
  totalDurationSec: number
  lessons: TrackLesson[]
}

export interface TrackDetail extends TrackSummary {
  instructor: { id: string; slug: string; displayName: string }
  modules: TrackModule[]
}

/** Instructor's own view: drafts included, student progress excluded. */
export interface InstructorTrackSummary {
  id: string
  slug: string
  title: string
  category: TrackCategory
  level: TrackLevel
  published: boolean
  moduleCount: number
  lessonCount: number
  totalDurationSec: number
  studentCount: number
}

export interface CreateTrackPayload {
  title: string
  description?: string | null
  category: TrackCategory
  level: TrackLevel
}

export type UpdateTrackPayload = Partial<CreateTrackPayload> & { published?: boolean }

/**
 * The whole arrangement, saved at once. Modules without an id were created in
 * this editing session.
 */
export interface SaveTrackStructurePayload {
  modules: { id?: string; title: string; lessonIds: string[] }[]
}
