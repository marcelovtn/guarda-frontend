import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES } from './config'
import enAssistant from './messages/en/assistant.json'
import enHelp from './messages/en/help.json'
import enAuth from './messages/en/auth.json'
import enCommon from './messages/en/common.json'
import enDashboard from './messages/en/dashboard.json'
import enFeedback from './messages/en/feedback.json'
import enGoals from './messages/en/goals.json'
import enHome from './messages/en/home.json'
import enLanding from './messages/en/landing.json'
import enNavigation from './messages/en/navigation.json'
import enOnboarding from './messages/en/onboarding.json'
import enPolicy from './messages/en/policy.json'
import enPremium from './messages/en/premium.json'
import enPurchase from './messages/en/purchase.json'
import enReminders from './messages/en/reminders.json'
import enSettings from './messages/en/settings.json'
import enTemplate from './messages/en/template.json'
import enTerms from './messages/en/terms.json'
import enTransactions from './messages/en/transactions.json'
import enUser from './messages/en/user.json'
import esAssistant from './messages/es/assistant.json'
import esHelp from './messages/es/help.json'
import esAuth from './messages/es/auth.json'
import esCommon from './messages/es/common.json'
import esDashboard from './messages/es/dashboard.json'
import esFeedback from './messages/es/feedback.json'
import esGoals from './messages/es/goals.json'
import esHome from './messages/es/home.json'
import esLanding from './messages/es/landing.json'
import esNavigation from './messages/es/navigation.json'
import esOnboarding from './messages/es/onboarding.json'
import esPolicy from './messages/es/policy.json'
import esPremium from './messages/es/premium.json'
import esPurchase from './messages/es/purchase.json'
import esReminders from './messages/es/reminders.json'
import esSettings from './messages/es/settings.json'
import esTemplate from './messages/es/template.json'
import esTerms from './messages/es/terms.json'
import esTransactions from './messages/es/transactions.json'
import esUser from './messages/es/user.json'
import ptAssistant from './messages/pt/assistant.json'
import ptGuarda from './messages/pt/guarda.json'
import ptHelp from './messages/pt/help.json'
import ptAuth from './messages/pt/auth.json'
import ptCommon from './messages/pt/common.json'
import ptDashboard from './messages/pt/dashboard.json'
import ptFeedback from './messages/pt/feedback.json'
import ptGoals from './messages/pt/goals.json'
import ptHome from './messages/pt/home.json'
import ptLanding from './messages/pt/landing.json'
import ptNavigation from './messages/pt/navigation.json'
import ptOnboarding from './messages/pt/onboarding.json'
import ptPolicy from './messages/pt/policy.json'
import ptPremium from './messages/pt/premium.json'
import ptPurchase from './messages/pt/purchase.json'
import ptReminders from './messages/pt/reminders.json'
import ptSettings from './messages/pt/settings.json'
import ptTemplate from './messages/pt/template.json'
import ptTerms from './messages/pt/terms.json'
import ptTransactions from './messages/pt/transactions.json'
import ptUser from './messages/pt/user.json'

export function initI18n() {
  if (i18n.isInitialized) return i18n

  let initialLng: string | undefined
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('language')
      if (stored && SUPPORTED_LOCALES.includes(stored as (typeof SUPPORTED_LOCALES)[number])) {
        initialLng = stored
      }
    } catch {}
  }

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        pt: {
          common: ptCommon,
          landing: ptLanding,
          auth: ptAuth,
          navigation: ptNavigation,
          settings: ptSettings,
          dashboard: ptDashboard,
          goals: ptGoals,
          transactions: ptTransactions,
          reminders: ptReminders,
          home: ptHome,
          assistant: ptAssistant,
          feedback: ptFeedback,
          user: ptUser,
          terms: ptTerms,
          policy: ptPolicy,
          template: ptTemplate,
          purchase: ptPurchase,
          onboarding: ptOnboarding,
          premium: ptPremium,
          help: ptHelp,
          guarda: ptGuarda,
        },
        en: {
          common: enCommon,
          landing: enLanding,
          auth: enAuth,
          navigation: enNavigation,
          settings: enSettings,
          dashboard: enDashboard,
          goals: enGoals,
          transactions: enTransactions,
          reminders: enReminders,
          home: enHome,
          assistant: enAssistant,
          feedback: enFeedback,
          user: enUser,
          terms: enTerms,
          policy: enPolicy,
          template: enTemplate,
          purchase: enPurchase,
          onboarding: enOnboarding,
          premium: enPremium,
          help: enHelp,
        },
        es: {
          common: esCommon,
          landing: esLanding,
          auth: esAuth,
          navigation: esNavigation,
          settings: esSettings,
          dashboard: esDashboard,
          goals: esGoals,
          transactions: esTransactions,
          reminders: esReminders,
          home: esHome,
          assistant: esAssistant,
          feedback: esFeedback,
          user: esUser,
          terms: esTerms,
          policy: esPolicy,
          template: esTemplate,
          purchase: esPurchase,
          onboarding: esOnboarding,
          premium: esPremium,
          help: esHelp,
        },
      },
      defaultNS: 'common',
      ns: [
        'common',
        'landing',
        'auth',
        'navigation',
        'settings',
        'dashboard',
        'goals',
        'transactions',
        'reminders',
        'home',
        'assistant',
        'feedback',
        'user',
        'terms',
        'policy',
        'template',
        'purchase',
        'onboarding',
        'premium',
        'help',
        'guarda',
      ],
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: [...SUPPORTED_LOCALES],
      interpolation: { escapeValue: false },
      lng: initialLng,
      initImmediate: false,
      detection: {
        order: ['localStorage', 'cookie', 'navigator', 'htmlTag', 'querystring', 'path'],
        lookupLocalStorage: 'language',
        lookupCookie: LOCALE_COOKIE,
        caches: ['cookie', 'localStorage'],
      },
    })

  return i18n
}
