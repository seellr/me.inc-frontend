import { CartProvider } from '@/lib/cart/context'
import { StorefrontShell } from './StorefrontShell'
import { getCustomerTokenCookie } from '@/lib/customer/auth'
import { Toaster } from '@/components/ui/sonner'

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const token = await getCustomerTokenCookie()
  return (
    <CartProvider initialAuthenticated={!!token}>
      <Toaster richColors position="top-right" />
      <StorefrontShell>{children}</StorefrontShell>
    </CartProvider>
  )
}
