export interface CustomerOrderItem {
  ulid: string
  product_name: string
  quantity: number
  unit_price: string | number
  total: string | number
  product_image_url?: string | null
}

export interface CustomerOrder {
  ulid: string
  invoice_number: string | null
  status: { id: number; label: string }
  total: string | number
  subtotal?: string | number
  discount?: string | number
  currency: string
  payment_method: { id: number; label: string }
  shipping_address: {
    full_name?: string
    line1?: string
    line2?: string | null
    city?: string
    country?: string
    postal_code?: string
    phone?: string
    email?: string
  } | null
  items: CustomerOrderItem[]
  created_at: string
  notes?: string | null
}
