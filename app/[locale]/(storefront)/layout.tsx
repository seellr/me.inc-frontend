import { CartProvider } from '@/lib/cart/context'
import { StorefrontShell } from './StorefrontShell'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <StorefrontShell>{children}</StorefrontShell>
    </CartProvider>
  )
}
