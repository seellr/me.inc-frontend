import type {
  CartCouponResponse,
  CartItemResponse,
  CartResponse,
  CartSummaryResponse,
} from '@/types/dto/storefront.dto'
import type { CartCoupon, CartItem, CartSummaryData } from '@/types/commerce'

export function mapCartItem(item: CartItemResponse): CartItem {
  return {
    productId: item.product_ulid,
    slug: item.product_slug ?? item.slug ?? '',
    name: item.product_name ?? '',
    image: item.product_image_url ?? item.image_url ?? null,
    price: item.unit_price ?? '0',
    quantity: item.quantity ?? 1,
    couponEligible: item.coupon_eligible ?? true,
    requiresShipping: item.requires_shipping ?? false,
    currency: item.currency ?? undefined,
    lineTotal: item.total_price ?? undefined,
  }
}

export function mapCartCoupon(coupon: CartCouponResponse): CartCoupon {
  return {
    code: coupon.code,
    discountType:
      coupon.discount_type && typeof coupon.discount_type === 'object'
        ? coupon.discount_type
        : undefined,
    discountValue: coupon.discount_value ?? '0',
    discountAmount: coupon.discount_amount ?? '0',
  }
}

export function mapCart(raw: CartResponse): CartSummaryData {
  const coupon = raw.coupon
    ? mapCartCoupon(raw.coupon)
    : raw.coupon_code
      ? {
          code: raw.coupon_code,
          discountValue: '0',
          discountAmount: raw.discount_amount ?? '0',
        }
      : null

  return {
    items: (raw.items ?? []).map(mapCartItem),
    coupon,
    subtotal: raw.subtotal ?? '0',
    discount_amount: raw.discount_amount ?? '0',
    vat_amount: raw.vat_amount ?? '0',
    vat_label: raw.vat_label ?? null,
    total: raw.total ?? raw.subtotal ?? '0',
    currency: raw.currency ?? 'SAR',
  }
}

export function mapCartSummary(raw: CartSummaryResponse): CartSummaryData {
  return {
    items: (raw.items ?? []).map(mapCartItem),
    coupon: raw.coupon ? mapCartCoupon(raw.coupon) : null,
    subtotal: raw.subtotal ?? '0',
    discount_amount: raw.discount_amount ?? '0',
    vat_amount: raw.vat_amount ?? '0',
    vat_label: raw.vat_label ?? null,
    total: raw.total ?? '0',
    currency: raw.currency ?? 'SAR',
  }
}
