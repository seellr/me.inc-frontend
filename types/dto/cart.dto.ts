import { z } from 'zod'

export const CartItemSchema = z.object({
  product_ulid: z.string(),
  product_name: z.string(),
  quantity: z.number(),
  unit_price: z.union([z.string(), z.number()]),
  total_price: z.union([z.string(), z.number()]),
  currency: z.string(),
  coupon_eligible: z.boolean(),
  requires_shipping: z.boolean(),
})
export type CartItemDto = z.infer<typeof CartItemSchema>

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  coupon_code: z.string().nullable(),
  currency: z.string(),
})
export type Cart = z.infer<typeof CartSchema>

export const CartSummarySchema = z.object({
  items: z.array(CartItemSchema),
  coupon: z.object({
    code: z.string(),
    discount_type: z.object({ id: z.number(), label: z.string() }),
    discount_value: z.union([z.string(), z.number()]),
    discount_amount: z.union([z.string(), z.number()]),
  }).nullable(),
  subtotal: z.union([z.string(), z.number()]),
  discount_amount: z.union([z.string(), z.number()]),
  vat_amount: z.union([z.string(), z.number()]),
  vat_label: z.string().nullable(),
  total: z.union([z.string(), z.number()]),
  currency: z.string(),
})
export type CartSummary = z.infer<typeof CartSummarySchema>
