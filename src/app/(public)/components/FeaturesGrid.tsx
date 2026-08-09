'use client'

import { CardIntroduction } from '@/components/layout/CardIntroduction'
import { BarChart, History, MessageCircle, Shield, Target, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FeaturesGrid() {
  const { t: tLanding } = useTranslation('landing')

  return (
    <section className="container mx-auto px-4 md:mb-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          {tLanding('FEATURES_SECTION_TITLE')}
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {tLanding('FEATURES_SECTION_DESCRIPTION')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <CardIntroduction
          className="group transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
          icon={<MessageCircle className="h-6 w-6" />}
          title={tLanding('FEATURES_WHATSAPP_TITLE')}
          description={tLanding('FEATURES_WHATSAPP_DESCRIPTION')}
        />
        <CardIntroduction
          className="group transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
          icon={<Shield className="h-6 w-6" />}
          title={tLanding('FEATURES_E2EE_TITLE')}
          description={tLanding('FEATURES_E2EE_DESCRIPTION')}
        />
        <CardIntroduction
          className="group transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
          icon={<Wallet className="h-6 w-6" />}
          title={tLanding('FEATURES_SMART_CATEGORIZATION_TITLE')}
          description={tLanding('FEATURES_SMART_CATEGORIZATION_DESCRIPTION')}
        />
        <CardIntroduction
          className="group transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
          icon={<History className="h-6 w-6" />}
          title={tLanding('FEATURES_DETAILED_HISTORY_TITLE')}
          description={tLanding('FEATURES_DETAILED_HISTORY_DESCRIPTION')}
        />
        <CardIntroduction
          className="group transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
          icon={<Target className="h-6 w-6" />}
          title={tLanding('FEATURES_GOALS_TITLE')}
          description={tLanding('FEATURES_GOALS_DESCRIPTION')}
        />
        <CardIntroduction
          className="group transition-all hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
          icon={<BarChart className="h-6 w-6" />}
          title={tLanding('FEATURES_DASHBOARD_TITLE')}
          description={tLanding('FEATURES_DASHBOARD_DESCRIPTION')}
        />
      </div>
    </section>
  )
}
