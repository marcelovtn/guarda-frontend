'use client'

import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { publicRoutes } from '@/utils/routes'
import { ArrowRight, LockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PhoneMockup } from 'phone-mockup-react'
import 'phone-mockup-react/dist/styles.css'
import { useTranslation } from 'react-i18next'

export function HeroSection() {
  const router = useRouter()
  const { t: tLanding } = useTranslation('landing')
  const isMobile = useIsMobile()

  return (
    <section className="container relative mx-auto px-4 py-16">
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 bg-violet-200 opacity-20 blur-3xl" />
      <div className="grid grid-cols-1 items-center justify-items-center gap-8 text-start md:grid-cols-[1fr_280px] md:justify-items-stretch lg:grid-cols-[1fr_280px_280px]">
        <div>
          <h1 className="mb-4 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-center text-4xl font-bold text-transparent dark:from-gray-100 dark:to-gray-400 sm:ml-4 md:ml-0 md:text-start md:text-6xl">
            {tLanding('HERO_TITLE_PREFIX')}
            <span className="text-violet-500">{tLanding('HERO_TITLE_HIGHLIGHT')}</span>
            {tLanding('HERO_TITLE_SUFFIX')}
          </h1>
          <div className="text-md mb-6 flex justify-center text-muted-foreground md:justify-start">
            <LockIcon className="mr-2 h-4 w-4" />
            {tLanding('HERO_SECURITY_TEXT')}
          </div>
          {!isMobile && (
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {tLanding('HERO_DESCRIPTION')}
            </p>
          )}

          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <Button
              size="lg"
              className="group relative bg-violet-600 text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25"
              onClick={() => router.push(publicRoutes.AUTH)}
            >
              {tLanding('HERO_CTA')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <div className="flex w-[280px] items-start justify-center self-start py-10">
          <div className="h-[560px] w-[280px] origin-top [&_.phone-mockup]:!h-full [&_.phone-mockup]:!max-h-[560px] [&_.phone-mockup]:!w-full [&_.phone-mockup]:!max-w-[280px]">
            <PhoneMockup model="samsung-s23">
              <div className="relative h-full w-full bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                  {...({ loading: 'lazy' } as React.VideoHTMLAttributes<HTMLVideoElement>)}
                >
                  <source
                    src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/firstsec_video.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </PhoneMockup>
          </div>
        </div>

        <div className="hidden w-[280px] items-start justify-center self-start py-10 lg:flex">
          <div className="h-[560px] w-[280px] origin-top [&_.phone-mockup]:!h-full [&_.phone-mockup]:!max-h-[560px] [&_.phone-mockup]:!w-full [&_.phone-mockup]:!max-w-[280px]">
            <PhoneMockup model="samsung-s23">
              <div className="relative h-full w-full bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/print_home_lp.jpg"
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  )
}
