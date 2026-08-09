'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import {
  Bell,
  ChartBar,
  CheckCircle,
  Landmark,
  LineChart,
  MessageCircle,
  PieChart,
  Shield,
  Target,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FeatureShowcase() {
  const isMobile = useIsMobile()
  return isMobile ? <FeatureShowcaseMobile /> : <FeatureShowcaseDesktop />
}

function FeatureShowcaseDesktop() {
  const { t } = useTranslation('landing')
  return (
    <div>
      {/* WhatsApp Feature */}
      <div className="mb-32 grid items-center gap-12 md:grid-cols-[6fr_4fr]">
        <div className="group order-2 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all md:order-1 md:mx-auto md:w-4/5 md:max-w-[80%]">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/gerencie_suas_finan%C3%A7as_pelo_whatsapp.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>

        <div className="relative order-1 md:order-2">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_WHATSAPP_TITLE')}</h3>
          <p className="mb-6 text-muted-foreground">{t('FEATURE_WHATSAPP_DESCRIPTION')}</p>
          <ul className="space-y-4">
            {[
              { icon: MessageCircle, text: t('FEATURE_WHATSAPP_BULLET_1') },
              { icon: Bell, text: t('FEATURE_WHATSAPP_BULLET_2') },
              { icon: CheckCircle, text: t('FEATURE_WHATSAPP_BULLET_3') },
              { icon: Shield, text: t('FEATURE_WHATSAPP_BULLET_4') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Categories Feature */}
      <div className="mb-32 grid items-center gap-12 md:grid-cols-[4fr_6fr]">
        <div className="relative">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_CATEGORIES_TITLE')}</h3>
          <p className="mb-6 text-muted-foreground">{t('FEATURE_CATEGORIES_DESCRIPTION')}</p>
          <ul className="space-y-4">
            {[
              { icon: ChartBar, text: t('FEATURE_CATEGORIES_BULLET_1') },
              { icon: PieChart, text: t('FEATURE_CATEGORIES_BULLET_2') },
              { icon: LineChart, text: t('FEATURE_CATEGORIES_BULLET_3') },
              { icon: Landmark, text: t('FEATURE_CATEGORIES_BULLET_4') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="group w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all md:mx-auto md:max-w-[80%]">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/categorize_e_controle_seus_gastos.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Transaction History Feature */}
      <div className="mb-32 grid items-center gap-12 md:grid-cols-[6fr_4fr]">
        <div className="group order-2 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all md:order-1 md:mx-auto md:w-4/5 md:max-w-[80%]">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/historico_completo_de_transa%C3%A7%C3%B5es.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>

        <div className="relative order-1 md:order-2">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_HISTORY_TITLE')}</h3>
          <p className="mb-6 text-muted-foreground">{t('FEATURE_HISTORY_DESCRIPTION')}</p>
          <ul className="space-y-4">
            {[
              { icon: ChartBar, text: t('FEATURE_HISTORY_BULLET_1') },
              { icon: PieChart, text: t('FEATURE_HISTORY_BULLET_2') },
              { icon: LineChart, text: t('FEATURE_HISTORY_BULLET_3') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Goals Feature */}
      <div className="mb-32 grid items-center gap-12 md:grid-cols-[4fr_6fr]">
        <div className="relative">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_GOALS_TITLE')}</h3>
          <p className="mb-6 text-muted-foreground">{t('FEATURE_GOALS_DESCRIPTION')}</p>
          <ul className="space-y-4">
            {[
              { icon: Target, text: 'Crie metas personalizadas' },
              { icon: ChartBar, text: 'Acompanhamento visual do progresso' },
              { icon: LineChart, text: 'Planejamento inteligente de economia' },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="group w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all md:mx-auto md:max-w-[80%]">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/estabele%C3%A7a_e_alcance_suas_metas.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Dashboard Feature */}
      <div className="grid items-center gap-12 md:grid-cols-[6fr_4fr]">
        <div className="group order-2 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all md:order-1 md:mx-auto md:w-4/5 md:max-w-[80%]">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/dashboard_financeiro.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
        <div className="relative order-1 md:order-2">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">Dashboard Financeiro</h3>
          <p className="mb-6 text-muted-foreground">
            Tenha uma visão ampla e detalhada da sua vida financeira em um só lugar. Analise
            gráficos interativos, acompanhe metas e visualize o desempenho das suas finanças de
            forma prática.
          </p>
          <ul className="space-y-4">
            {[
              {
                icon: ChartBar,
                text: 'Análise visual intuitiva',
              },
              { icon: PieChart, text: 'Monitoramento em tempo real' },
              { icon: LineChart, text: 'Integração com relatórios automáticos (em breve)' },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function FeatureShowcaseMobile() {
  const { t } = useTranslation('landing')
  return (
    <div>
      {/* WhatsApp Feature */}
      <div className="mb-10 grid items-center gap-12">
        <div className="relative order-1">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_WHATSAPP_TITLE')}</h3>
          <ul className="space-y-4">
            {[
              { icon: MessageCircle, text: t('FEATURE_WHATSAPP_BULLET_1') },
              { icon: Bell, text: t('FEATURE_WHATSAPP_BULLET_2') },
              { icon: CheckCircle, text: t('FEATURE_WHATSAPP_BULLET_3') },
              { icon: Shield, text: t('FEATURE_WHATSAPP_BULLET_4') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group order-2 mx-auto mb-16 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/gerencie_suas_finan%C3%A7as_pelo_whatsapp_MOBILE.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Categories Feature */}
      <div className="mb-10 grid items-center gap-12">
        <div className="relative">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_CATEGORIES_TITLE')}</h3>
          <ul className="space-y-4">
            {[
              { icon: ChartBar, text: t('FEATURE_CATEGORIES_BULLET_1') },
              { icon: PieChart, text: t('FEATURE_CATEGORIES_BULLET_2') },
              { icon: LineChart, text: t('FEATURE_CATEGORIES_BULLET_3') },
              { icon: Landmark, text: t('FEATURE_CATEGORIES_BULLET_4') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group mx-auto mb-16 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/categorize_e_controle_seus_gastos_MOBILE.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Transaction History Feature */}
      <div className="mb-10 grid items-center gap-12">
        <div className="relative">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_HISTORY_TITLE')}</h3>
          <ul className="space-y-4">
            {[
              { icon: ChartBar, text: t('FEATURE_HISTORY_BULLET_1') },
              { icon: PieChart, text: t('FEATURE_HISTORY_BULLET_2') },
              { icon: LineChart, text: t('FEATURE_HISTORY_BULLET_3') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group mx-auto mb-16 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/historico_completo_de_transa%C3%A7%C3%B5es_MOBILE.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Goals Feature */}
      <div className="mb-10 grid items-center gap-12">
        <div className="relative">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_GOALS_TITLE')}</h3>
          <ul className="space-y-4">
            {[
              { icon: Target, text: t('FEATURE_GOALS_BULLET_1') },
              { icon: ChartBar, text: t('FEATURE_GOALS_BULLET_2') },
              { icon: LineChart, text: t('FEATURE_GOALS_BULLET_3') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group mx-auto mb-16 w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/estabele%C3%A7a_e_alcance_suas_metas_MOBILE.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Dashboard Feature */}
      <div className="grid items-center gap-12">
        <div className="relative">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">{t('FEATURE_DASHBOARD_TITLE')}</h3>
          <ul className="space-y-4">
            {[
              { icon: ChartBar, text: t('FEATURE_DASHBOARD_BULLET_1') },
              { icon: PieChart, text: t('FEATURE_DASHBOARD_BULLET_2') },
              { icon: LineChart, text: t('FEATURE_DASHBOARD_BULLET_3') },
            ].map((item, index) => (
              <li key={index} className="flex items-start transition-transform hover:translate-x-2">
                <div className="mr-2 rounded-lg bg-violet-500/10 p-1 text-violet-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group mx-auto w-4/5 max-w-[360px] overflow-hidden rounded-xl border border-violet-500/20 bg-transparent shadow-lg shadow-violet-950/25 transition-all">
          <video
            src="https://pub-8b52a6f3539d4528ba415494d8ec39f0.r2.dev/dashboard_financeiro_MOBILE.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full transition-transform group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  )
}
