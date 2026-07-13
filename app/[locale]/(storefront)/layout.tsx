import { SmoothScroll } from '@/components/smooth-scroll'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartProvider } from '@/lib/cart/context'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SmoothScroll>
        <Navbar />
        {children}
        <Footer />
      </SmoothScroll>
    </CartProvider>
  )
}
