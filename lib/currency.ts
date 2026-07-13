const CURRENCY_LOCALE: Record<string, string> = {
  ar: 'ar-SA',
  en: 'en-US',
}

/** Formats a price in SAR, using the locale's digit/grouping conventions. */
export function formatCurrency(amount: number, locale: string): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[locale] ?? 'en-US', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

/** Formats a date/time using the locale's conventions (order timelines, receipts). */
export function formatDateTime(value: string | Date, locale: string): string {
  return new Intl.DateTimeFormat(CURRENCY_LOCALE[locale] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
