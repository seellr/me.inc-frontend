'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { ProductCard } from './ProductCard'
import type { StoreProduct } from '@/types/commerce'

export function ProductCarousel({ products }: { products: StoreProduct[] }) {
  const locale = useLocale()
  const trackRef = useRef<HTMLDivElement>(null)
  const isRtl = locale === 'ar'

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const amount = track.clientWidth * 0.8 * (isRtl ? -1 : 1) * direction
    track.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length > 2 && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            aria-label="previous"
            onClick={() => scrollBy(-1)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-muted"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label="next"
            onClick={() => scrollBy(1)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-muted"
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  )
}
