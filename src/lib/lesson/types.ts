import type { PublishStatus, TrackCategory } from '@/lib/instructor/types'

/** Where a lesson sits, or null when it is not in a track yet. */
export interface LessonTrackRef {
  trackId: string
  trackSlug: string
  trackTitle: string
  category: TrackCategory
  moduleId: string
  moduleTitle: string
  /** 1-based ordinal of the module within the track — "Módulo 2". */
  moduleNumber: number
  /** 1-based index of the lesson within its module. */
  modulePosition: number
  trackPosition: number
}

export interface LessonListItem {
  id: string
  title: string
  durationSec: number
  publishedAt: string | null
  track: LessonTrackRef | null
}

export interface VideoProcessingStatus {
  state: 'pending' | 'processing' | 'ready' | 'failed'
  percent: number
  error?: string
}

export interface LessonPlayback {
  id: string
  title: string
  description: string | null
  durationSec: number
  videoUrl: string | null
  processing: VideoProcessingStatus
  instructor: {
    id: string
    slug: string
    displayName: string
    photoUrl: string | null
    lessonCount: number
    trackCount: number
    lastPublishedAt: string | null
  }
  track: LessonTrackRef | null
  progress: { completed: boolean; lastPositionSec: number }
  siblings: {
    id: string
    title: string
    durationSec: number
    trackPosition: number
    completed: boolean
    /** Seconds watched — distinguishes "started" from "never opened". */
    lastPositionSec: number
  }[]
  nextLesson: { id: string; title: string; durationSec: number } | null
}

export interface InstructorLesson {
  id: string
  title: string
  durationSec: number
  status: PublishStatus
  publishedAt: string | null
  hasVideo: boolean
  track: LessonTrackRef | null
  viewerCount: number
}

/**
 * One lesson as its own screen, for the instructor.
 *
 * Carries `trackId` and `moduleId` raw because they prefill two selects; the
 * "aula 07 de 18" numbering the list DTO computes has no meaning here.
 */
export interface InstructorLessonDetail {
  id: string
  title: string
  description: string | null
  durationSec: number
  status: PublishStatus
  publishedAt: string | null
  videoKey: string | null
  processing: VideoProcessingStatus
  trackId: string | null
  moduleId: string | null
  trackTitle: string | null
  moduleTitle: string | null
}

export interface CreateLessonPayload {
  title: string
  description?: string | null
  videoKey?: string | null
  durationSec?: number
  moduleId?: string | null
  status?: PublishStatus
}

export type UpdateLessonPayload = Partial<CreateLessonPayload>

export interface LessonUploadTarget {
  uploadUrl: string
  key: string
  expiresIn: number
}
