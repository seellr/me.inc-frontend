import type { StoreCategory, StoreProduct } from '@/types/commerce'
import { enumId, enumLabel } from '@/types/dto/storefront.dto'

/**
 * Pure product mapping — safe on both server and client.
 * Pass an image resolver to make relative media absolute.
 */
export interface MappableProduct {
  ulid: string
  slug: string
  name?: string | null
  internal_name?: string | null
  one_liner?: string | null
  hero_image_url?: string | null
  base_price?: string | number | null
  sale_price?: string | number | null
  type?: number | { id: number; label: string } | null
  featured?: boolean | null
}

export function mapProduct(
  product: MappableProduct,
  resolveImage: (value: string | null | undefined) => string | null = (value) => value ?? null,
): StoreProduct {
  const price = product.sale_price ?? product.base_price ?? '0'
  const name = product.name ?? product.internal_name ?? ''

  return {
    id: product.ulid,
    slug: product.slug,
    name,
    nameAr: name,
    category: enumLabel(product.type, ''),
    categorySlug: String(enumId(product.type) ?? ''),
    price,
    image: resolveImage(product.hero_image_url),
    description: product.one_liner ?? '',
    featured: product.featured ?? false,
  }
}

export function mapCategory(
  category: {
    slug?: string | null
    name?: string | null
    label?: string | null
    description?: string | null
    image?: string | null
    image_url?: string | null
  },
  index = 0,
  resolveImage: (value: string | null | undefined) => string | null = (value) => value ?? null,
): StoreCategory {
  const colors: StoreCategory['color'][] = ['pink', 'teal', 'green']
  return {
    slug: category.slug ?? `category-${index + 1}`,
    name: category.name ?? category.label ?? '',
    heading: category.name ?? category.label ?? '',
    body: category.description ?? '',
    image: resolveImage(category.image_url ?? category.image) ?? '',
    color: colors[index % colors.length],
  }
}
