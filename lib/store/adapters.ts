import 'server-only'
import type { Product } from '@/types/dto/product.dto'
import type { StorefrontProduct } from '@/types/dto/storefront.dto'
import type { StoreCategory, StoreProduct } from '@/types/commerce'
import { mediaUrl } from '@/lib/server/media'
import { mapCategory, mapProduct } from './product-mapper'

type AnyProduct = Product | StorefrontProduct

export function productToStoreProduct(product: AnyProduct): StoreProduct {
  return mapProduct(product, mediaUrl)
}

export function categoryToStoreCategory(
  category: Parameters<typeof mapCategory>[0],
  index = 0,
): StoreCategory {
  return mapCategory(category, index, mediaUrl)
}
