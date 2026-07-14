export interface StoreCategory {
  slug: string
  name: string
  heading: string
  body: string
  image: string
  color: 'pink' | 'teal' | 'green'
}

export interface ProductVariant {
  id: string
  label: string
  priceDelta?: number
}

export interface StoreProduct {
  id: string
  slug: string
  name: string
  nameAr: string
  category: string
  categorySlug: string
  price: number
  image: string | null
  description: string
  rating: number
  reviews: number
  featured?: boolean
  variants?: string[]
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  quantity: number
  variant?: string
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

export type OrderStage = 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered'

export interface OrderTimelineEntry {
  stage: OrderStage
  timestamp: string | null
}

export interface Order {
  id: string
  number: string
  email: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  address: Address
  currentStage: OrderStage
  timeline: OrderTimelineEntry[]
  createdAt: string
}
