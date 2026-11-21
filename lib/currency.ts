import type { MoneyValue } from '@/types/commerce'

const CURRENCY_LOCALE: Record<string, string> = {
  ar: 'ar-SA',
  en: 'en-US',
}

function decimalsOf(value: MoneyValue): number {
  if (typeof value === 'number') return Number.isInteger(value) ? 0 : 2
  const match = /\.(\d+)$/.exec(value.trim())
  return match ? Math.min(match[1].length, 2) : 0
}

/**
 * Formats an API money value for display.
 *
 * The API is the single source of truth: we never add, subtract or multiply
 * money in the client. This helper only parses the string for Intl formatting.
 */
export function formatMoney(
  amount: MoneyValue | null | undefined,
  currency = 'SAR',
  locale = 'en',
): string {
  if (amount === null || amount === undefined || amount === '') return ''
  const numeric = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(numeric)) return String(amount)

  const fractionDigits = decimalsOf(amount)

  return new Intl.NumberFormat(CURRENCY_LOCALE[locale] ?? 'en-US', {
    style: 'currency',
    currency: currency || 'SAR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric)
}

/** Backwards-compatible wrapper used by older components. */
export function formatCurrency(amount: MoneyValue, locale: string, currency = 'SAR'): string {
  return formatMoney(amount, currency, locale)
}

/** Formats a date/time using the locale's conventions. */
export function formatDateTime(value: string | Date | null | undefined, locale: string): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(CURRENCY_LOCALE[locale] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDate(value: string | Date | null | undefined, locale: string): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(CURRENCY_LOCALE[locale] ?? 'en-US', {
    dateStyle: 'medium',
  }).format(date)
}
