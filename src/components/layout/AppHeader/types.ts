import type { LucideIcon } from 'lucide-react'

export type AppHeaderVariant = 'student' | 'instructor'

export interface AppHeaderNavItem {
  label: string
  href: string
  /** Shown in the mobile bottom bar, which is icon-first. */
  icon?: LucideIcon
  /**
   * Match the path exactly instead of by prefix. Needed for "/home", which
   * would otherwise stay highlighted on every nested route.
   */
  exact?: boolean
}
