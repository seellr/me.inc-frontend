export type MoneyValue = string | number

export interface StoreCategory {
  slug: string
  name: string
  heading: string
  body: string
  image: string
  color: 'pink' | 'teal' | 'green'
}

export interface StoreProduct {
  id: string
  slug: string
  name: string
  nameAr: string
  category: string
  categorySlug: string
  price: MoneyValue
  image: string | null
  description: string
  featured?: boolean
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string | null
  /** API money string — never recomputed with float arithmetic. */
  price: MoneyValue
  quantity: number
  variant?: string
  couponEligible?: boolean
  requiresShipping?: boolean
  currency?: string
  /** API line total; use this for display when present. */
  lineTotal?: MoneyValue
}

export interface CartCoupon {
  code: string
  discountType?: { id: number; label: string }
  discountValue: MoneyValue
  discountAmount: MoneyValue
}

export interface CartSummaryData {
  items: CartItem[]
  coupon: CartCoupon | null
  subtotal: MoneyValue
  discount_amount: MoneyValue
  vat_amount: MoneyValue
  vat_label: string | null
  total: MoneyValue
  currency: string
}

export interface Address {
  fullName: string
  line1: string
  line2?: string
  city: string
  country: string
  postalCode: string
  phone: string
}

export interface OrderLine {
  ulid: string
  productUlid: string | null
  name: string
  quantity: number
  unitPrice: MoneyValue
  total: MoneyValue
  image: string | null
  requiresShipping: boolean
}

export interface CustomerOrderView {
  ulid: string
  invoiceNumber: string | null
  statusId: number | null
  statusLabel: string
  subtotal: MoneyValue | null
  discount: MoneyValue | null
  vat: MoneyValue | null
  shipping: MoneyValue | null
  total: MoneyValue | null
  currency: string
  paymentMethodLabel: string
  requiresShipping: boolean
  shippingAddress: {
    fullName: string | null
    line1: string | null
    line2: string | null
    city: string | null
    country: string | null
    postalCode: string | null
    phone: string | null
    email: string | null
  } | null
  items: OrderLine[]
  createdAt: string | null
  notes: string | null
  shipmentUlid: string | null
}

export const ORDER_STATUS = {
  PENDING: 1,
  PAID: 2,
  FAILED: 3,
  REFUNDED: 4,
  PENDING_COD: 5,
  COD_CONFIRMED: 6,
} as const

export const PAYMENT_METHOD = {
  PAYMOB_CARD: 1,
  PAYMOB_WALLET: 2,
  STRIPE: 3,
  COD: 4,
} as const

export type PaymentMethodId = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export interface FunnelStepView {
  step: 'oto' | 'downsell' | 'complete' | 'dashboard'
  orderUlid: string | null
  product: { ulid: string; name: string; image: string | null } | null
  price: MoneyValue | null
  originalPrice: MoneyValue | null
  timerMinutes: number | null
  headline: string | null
  paymentFailed: boolean
}

export interface DeliveryView {
  productUlid: string | null
  downloadUrl: string | null
  token: string | null
  expiresAt: string | null
  downloadLimit: number | null
  remainingDownloads: number | null
}

export interface ShipmentEventView {
  status: string
  description: string | null
  occurredAt: string | null
}

export interface ShipmentTrackView {
  ulid: string | null
  trackingNumber: string | null
  carrier: string | null
  status: string | null
  estimatedDelivery: string | null
  events: ShipmentEventView[]
}

export interface ShippingMethodView {
  id: number | null
  ulid: string | null
  code: string | null
  name: string
  description: string | null
  price: MoneyValue | null
  currency: string | null
  estimatedDelivery: string | null
}
