import 'server-only'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'token_customer'

export async function setCustomerTokenCookie(token: string, expiresInSeconds: number): Promise<void> {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: expiresInSeconds,
  })
}

export async function getCustomerTokenCookie(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export async function clearCustomerTokenCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
