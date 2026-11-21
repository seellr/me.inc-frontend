import 'server-only'
import { cookies } from 'next/headers'

/**
 * The customer access token lives ONLY in this httpOnly cookie. It is never
 * returned in a JSON body, never written to localStorage and never logged.
 */
export const CUSTOMER_TOKEN_COOKIE = 'customer_token'

const THIRTY_DAYS = 30 * 24 * 60 * 60

export async function setCustomerTokenCookie(
  token: string,
  expiresInSeconds: number,
): Promise<void> {
  const store = await cookies()
  const maxAge =
    Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
      ? Math.min(expiresInSeconds, THIRTY_DAYS)
      : 60 * 60

  store.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Lax (not Strict) so the cookie is still present when returning from a
    // full-page payment/OAuth redirect.
    sameSite: 'lax',
    path: '/',
    maxAge,
  })
}

export async function getCustomerTokenCookie(): Promise<string | null> {
  const store = await cookies()
  return store.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null
}

export async function clearCustomerTokenCookie(): Promise<void> {
  const store = await cookies()
  store.delete(CUSTOMER_TOKEN_COOKIE)
}
