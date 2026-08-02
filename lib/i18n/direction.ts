const RTL_LOCALES = new Set(['ar'])

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}
