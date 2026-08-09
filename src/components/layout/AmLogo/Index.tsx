import { Orbit } from 'lucide-react'

export default function AmLogo() {
  return (
    <div className="flex items-center gap-2 md:mb-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
        <Orbit className="h-5 w-5 text-violet-500" />
      </div>
      <span className="font-bold text-gray-900 dark:text-gray-100 md:text-2xl">Blank</span>
    </div>
  )
}
