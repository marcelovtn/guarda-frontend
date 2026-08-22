import { Suspense } from 'react'
import { ClientHandlers } from './components/ClientHandlers'
import { LandingCta } from './components/LandingCta'
import { LandingExplore } from './components/LandingExplore'
import { LandingFaq } from './components/LandingFaq'
import { LandingFooter } from './components/LandingFooter'
import { LandingHero } from './components/LandingHero'
import { LandingInstructors } from './components/LandingInstructors'
import { LandingPricing } from './components/LandingPricing'
import { LandingThesis } from './components/LandingThesis'
import { LandingTrack } from './components/LandingTrack'

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ClientHandlers />
      </Suspense>
      <LandingHero />
      <LandingThesis />
      <LandingTrack />
      <LandingExplore />
      <LandingInstructors />
      <LandingPricing />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </>
  )
}
