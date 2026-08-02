'use client'

import { usePathname } from 'next/navigation'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const AUTH_SUFFIXES = ['/login', '/register']

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = AUTH_SUFFIXES.some((s) => pathname.endsWith(s))

  if (isAuth) return <>{children}</>

  return (
    <SmoothScroll>
      <Navbar />
      {children}
      <Footer />
    </SmoothScroll>
  )
}
