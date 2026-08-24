export interface Subscription {
  id: string
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE'
  /** Cents. */
  monthlyPrice: number
  renewsAt: string | null
  canceledAt: string | null
  instructor: {
    id: string
    slug: string
    displayName: string
    photoUrl: string | null
    trackCount: number
    lessonCount: number
    lastPublishedAt: string | null
  }
  currentTrack: {
    slug: string
    title: string
    completedCount: number
    totalCount: number
  } | null
}
