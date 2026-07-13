import type { Product } from '@/types/dto/product.dto'
import type { StoreProduct } from '@/types/commerce'

// No category endpoint exists on the backend yet (flagged separately) —
// product "type" is the closest analog available today, used as a
// stand-in until a real category/tag resource exists.
export function productToStoreProduct(product: Product): StoreProduct {
  return {
    id: product.ulid,
    slug: product.slug,
    name: product.name,
    nameAr: product.name,
    category: product.type.label,
    categorySlug: String(product.type.id),
    price: Number(product.sale_price ?? product.base_price),
    image: product.hero_image_url ?? '/images/placeholder-product.png',
    description: product.one_liner ?? '',
    // Backend has no rating/review aggregate yet — 0 rather than fabricated.
    rating: 0,
    reviews: 0,
    featured: product.featured,
  }
}
