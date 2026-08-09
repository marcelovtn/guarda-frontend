import type { ReactNode } from 'react'
import { InstructorGuard } from './components/InstructorGuard'

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return <InstructorGuard>{children}</InstructorGuard>
}
