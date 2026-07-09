export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ar'

export const dictionaries = {
  ar: {
    common: {
      language: 'العربية',
      switchLanguage: 'English',
    },
  },
  en: {
    common: {
      language: 'English',
      switchLanguage: 'العربية',
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]
