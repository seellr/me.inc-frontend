import { z } from 'zod'

/**
 * Tolerant response schemas.
 *
 * Responses must never break the UI because the backend added/omitted an
 * optional field. Enums arrive either as an int or as { id, label }.
 */

export const MoneySchema = z.union([z.string(), z.number()])
export type Money = z.infer<typeof MoneySchema>

export const EnumValueSchema = z.union([
  z.number().int(),
  z.object({ id: z.number().int(), label: z.string() }),
])
export type EnumValue = z.infer<typeof EnumValueSchema>

export function enumId(value: EnumValue | null | undefined): number | null {
  if (value === null || value === undefined) return null
  return typeof value === 'number' ? value : value.id
}

export function enumLabel(value: EnumValue | null | undefined, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  return typeof value === 'number' ? fallback || String(value) : value.label
}

export const ImageUrlSchema = z.string().nullish()

export const StorefrontProductSchema = z
  .object({
    ulid: z.string(),
    slug: z.string(),
    name: z.string().nullish(),
    internal_name: z.string().nullish(),
    one_liner: z.string().nullish(),
    hero_image_url: ImageUrlSchema,
    base_price: MoneySchema.nullish(),
    sale_price: MoneySchema.nullish(),
    currency: z.string().nullish(),
    type: EnumValueSchema.nullish(),
    featured: z.boolean().nullish(),
    status: EnumValueSchema.nullish(),
    coupon_eligible: z.boolean().nullish(),
  })
  .passthrough()
export type StorefrontProduct = z.infer<typeof StorefrontProductSchema>

export const StoreCategorySchema = z
  .object({
    ulid: z.string().nullish(),
    slug: z.string().nullish(),
    name: z.string().nullish(),
    label: z.string().nullish(),
    image: z.string().nullish(),
    image_url: ImageUrlSchema,
    description: z.string().nullish(),
    products_count: z.number().nullish(),
  })
  .passthrough()
export type StoreCategory = z.infer<typeof StoreCategorySchema>

export const HomeResponseSchema = z
  .object({
    brand: z.unknown().nullish(),
    config: z.unknown().nullish(),
    featured_products: z.array(StorefrontProductSchema).nullish(),
    categories: z.array(StoreCategorySchema).nullish(),
  })
  .passthrough()
export type HomeResponse = z.infer<typeof HomeResponseSchema>

export const BrandSchema = z
  .object({
    id: z.number().nullish(),
    ulid: z.string().nullish(),
    slug: z.string().nullish(),
    name: z.string().nullish(),
    logo_url: ImageUrlSchema,
    currency: z.string().nullish(),
    locale: z.string().nullish(),
  })
  .passthrough()

export const CartItemResponseSchema = z
  .object({
    product_ulid: z.string(),
    product_name: z.string().nullish(),
    product_slug: z.string().nullish(),
    slug: z.string().nullish(),
    product_image_url: ImageUrlSchema,
    image_url: ImageUrlSchema,
    quantity: z.number().int().nullish(),
    unit_price: MoneySchema.nullish(),
    total_price: MoneySchema.nullish(),
    currency: z.string().nullish(),
    coupon_eligible: z.boolean().nullish(),
    requires_shipping: z.boolean().nullish(),
  })
  .passthrough()
export type CartItemResponse = z.infer<typeof CartItemResponseSchema>

export const CartCouponResponseSchema = z
  .object({
    code: z.string(),
    discount_type: EnumValueSchema.nullish(),
    discount_value: MoneySchema.nullish(),
    discount_amount: MoneySchema.nullish(),
  })
  .passthrough()
export type CartCouponResponse = z.infer<typeof CartCouponResponseSchema>

export const CartResponseSchema = z
  .object({
    items: z.array(CartItemResponseSchema).nullish(),
    coupon_code: z.string().nullish(),
    coupon: CartCouponResponseSchema.nullish(),
    subtotal: MoneySchema.nullish(),
    discount_amount: MoneySchema.nullish(),
    vat_amount: MoneySchema.nullish(),
    vat_label: z.string().nullish(),
    total: MoneySchema.nullish(),
    currency: z.string().nullish(),
  })
  .passthrough()
export type CartResponse = z.infer<typeof CartResponseSchema>

export const CartSummaryResponseSchema = z
  .object({
    items: z.array(CartItemResponseSchema).nullish(),
    coupon: CartCouponResponseSchema.nullish(),
    subtotal: MoneySchema.nullish(),
    discount_amount: MoneySchema.nullish(),
    vat_amount: MoneySchema.nullish(),
    vat_label: z.string().nullish(),
    total: MoneySchema.nullish(),
    currency: z.string().nullish(),
  })
  .passthrough()
export type CartSummaryResponse = z.infer<typeof CartSummaryResponseSchema>

export const OrderItemResponseSchema = z
  .object({
    ulid: z.string().nullish(),
    product_ulid: z.string().nullish(),
    product_name: z.string().nullish(),
    quantity: z.number().int().nullish(),
    unit_price: MoneySchema.nullish(),
    total: MoneySchema.nullish(),
    total_price: MoneySchema.nullish(),
    product_image_url: ImageUrlSchema,
    requires_shipping: z.boolean().nullish(),
  })
  .passthrough()
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>

export const ShippingAddressSchema = z
  .object({
    full_name: z.string().nullish(),
    name: z.string().nullish(),
    line1: z.string().nullish(),
    address: z.string().nullish(),
    line2: z.string().nullish(),
    city: z.string().nullish(),
    country: z.string().nullish(),
    postal_code: z.string().nullish(),
    phone: z.string().nullish(),
    email: z.string().nullish(),
  })
  .passthrough()

export const CustomerOrderResponseSchema = z
  .object({
    ulid: z.string(),
    invoice_number: z.string().nullish(),
    status: EnumValueSchema.nullish(),
    subtotal: MoneySchema.nullish(),
    discount: MoneySchema.nullish(),
    discount_amount: MoneySchema.nullish(),
    vat_amount: MoneySchema.nullish(),
    shipping_amount: MoneySchema.nullish(),
    total: MoneySchema.nullish(),
    currency: z.string().nullish(),
    payment_method: EnumValueSchema.nullish(),
    payment_gateway: EnumValueSchema.nullish(),
    requires_shipping: z.boolean().nullish(),
    shipping_address: ShippingAddressSchema.nullish(),
    shipment_ulid: z.string().nullish(),
    shipment: z
      .object({ ulid: z.string().nullish(), tracking_number: z.string().nullish() })
      .passthrough()
      .nullish(),
    items: z.array(OrderItemResponseSchema).nullish(),
    created_at: z.string().nullish(),
    notes: z.string().nullish(),
  })
  .passthrough()
export type CustomerOrderResponse = z.infer<typeof CustomerOrderResponseSchema>

export const OrderPayResponseSchema = z
  .object({
    redirect_url: z.string().nullish(),
    iframe_token: z.string().nullish(),
    client_secret: z.string().nullish(),
    provider: EnumValueSchema.nullish(),
    payment_method: EnumValueSchema.nullish(),
  })
  .passthrough()
export type OrderPayResponse = z.infer<typeof OrderPayResponseSchema>

export const FunnelStepValues = ['oto', 'downsell', 'complete', 'dashboard'] as const
export type FunnelStepName = (typeof FunnelStepValues)[number]

export const FunnelNextStepSchema = z
  .object({
    step: z.enum(FunnelStepValues),
    order_ulid: z.string().nullish(),
    product: z
      .object({
        ulid: z.string(),
        name: z.string().nullish(),
        hero_image_url: ImageUrlSchema,
      })
      .passthrough()
      .nullish(),
    price: MoneySchema.nullish(),
    original_price: MoneySchema.nullish(),
    timer_minutes: z.number().nullish(),
    headline: z.string().nullish(),
    payment_failed: z.boolean().nullish(),
  })
  .passthrough()
export type FunnelNextStep = z.infer<typeof FunnelNextStepSchema>

export const DeliveryResponseSchema = z
  .object({
    product_ulid: z.string().nullish(),
    download_url: z.string().nullish(),
    url: z.string().nullish(),
    token: z.string().nullish(),
    expires_at: z.string().nullish(),
    download_limit: z.number().nullish(),
    remaining_downloads: z.number().nullish(),
    delivery_method: EnumValueSchema.nullish(),
  })
  .passthrough()
export type DeliveryResponse = z.infer<typeof DeliveryResponseSchema>

export const ShipmentEventSchema = z
  .object({
    status: z.union([z.string(), EnumValueSchema]).nullish(),
    label: z.string().nullish(),
    description: z.string().nullish(),
    occurred_at: z.string().nullish(),
    created_at: z.string().nullish(),
  })
  .passthrough()

export const ShipmentTrackResponseSchema = z
  .object({
    ulid: z.string().nullish(),
    tracking_number: z.string().nullish(),
    carrier: z.union([z.string(), EnumValueSchema]).nullish(),
    status: z.union([z.string(), EnumValueSchema]).nullish(),
    estimated_delivery: z.string().nullish(),
    events: z.array(ShipmentEventSchema).nullish(),
  })
  .passthrough()
export type ShipmentTrackResponse = z.infer<typeof ShipmentTrackResponseSchema>

export const ShippingMethodResponseSchema = z
  .object({
    id: z.number().nullish(),
    ulid: z.string().nullish(),
    code: z.string().nullish(),
    name: z.string().nullish(),
    label: z.string().nullish(),
    description: z.string().nullish(),
    price: MoneySchema.nullish(),
    cost: MoneySchema.nullish(),
    currency: z.string().nullish(),
    estimated_days: z.number().nullish(),
    estimated_delivery: z.string().nullish(),
    active: z.boolean().nullish(),
  })
  .passthrough()
export type ShippingMethodResponse = z.infer<typeof ShippingMethodResponseSchema>

export const ShippingMethodsResponseSchema = z.union([
  z.array(ShippingMethodResponseSchema),
  z.object({ methods: z.array(ShippingMethodResponseSchema).nullish() }).passthrough(),
  z.object({ data: z.array(ShippingMethodResponseSchema).nullish() }).passthrough(),
])

export const CouponValidationSchema = z
  .object({
    valid: z.boolean().nullish(),
    code: z.string().nullish(),
    discount_amount: MoneySchema.nullish(),
    discount_type: EnumValueSchema.nullish(),
    message: z.string().nullish(),
  })
  .passthrough()
export type CouponValidation = z.infer<typeof CouponValidationSchema>

export const SearchProductsResponseSchema = z.union([
  z.array(StorefrontProductSchema),
  z
    .object({
      products: z.array(StorefrontProductSchema).nullish(),
      data: z.array(StorefrontProductSchema).nullish(),
    })
    .passthrough(),
])

// ── Strict request schemas ──────────────────────────────────────────────────

export const PaymentMethodIdSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
export type PaymentMethodId = z.infer<typeof PaymentMethodIdSchema>

export const CreateOrderRequestSchema = z
  .object({
    payment_method: PaymentMethodIdSchema,
    coupon_code: z.string().min(1).max(64).nullish(),
    shipping_name: z.string().min(1).max(120).optional(),
    shipping_phone: z.string().min(5).max(30).optional(),
    shipping_address: z.string().min(1).max(500).optional(),
    shipping_city: z.string().min(1).max(120).optional(),
    shipping_country: z.string().min(1).max(120).optional(),
  })
  .strict()
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>

export const PayOrderRequestSchema = z
  .object({
    method: PaymentMethodIdSchema.optional(),
  })
  .strict()
export type PayOrderRequest = z.infer<typeof PayOrderRequestSchema>

export const FunnelDecideRequestSchema = z.object({ accepted: z.boolean() }).strict()
export type FunnelDecideRequest = z.infer<typeof FunnelDecideRequestSchema>

export const CreateShipmentRequestSchema = z
  .object({
    carrier: z.string().min(1).max(80).optional(),
    tracking_number: z.string().min(1).max(120).optional(),
    shipping_method_id: z.number().int().positive().optional(),
    notes: z.string().max(500).optional(),
  })
  .strict()
export type CreateShipmentRequest = z.infer<typeof CreateShipmentRequestSchema>

export const ForgotPasswordRequestSchema = z
  .object({ email: z.string().email().max(180) })
  .strict()

export const ResetPasswordRequestSchema = z
  .object({
    email: z.string().email().max(180).optional(),
    token: z.string().min(1).max(500),
    password: z.string().min(8).max(128),
    password_confirmation: z.string().min(8).max(128),
  })
  .strict()
  .refine((data) => data.password === data.password_confirmation, {
    message: 'passwords_do_not_match',
    path: ['password_confirmation'],
  })
