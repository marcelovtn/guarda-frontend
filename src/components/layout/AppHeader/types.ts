export type AppHeaderVariant = 'student' | 'instructor'

export interface AppHeaderNavItem {
  label: string
  href: string
  /**
   * Match the path exactly instead of by prefix. Needed for "/home", which
   * would otherwise stay highlighted on every nested route.
   */
  exact?: boolean
}
