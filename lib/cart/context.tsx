'use client'

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { customerFetchClient } from '@/lib/customer/api-client'
import type { Cart, CartItemDto } from '@/types/dto/cart.dto'
import type { CartItem } from '@/types/commerce'

// Backend cart items don't include slug/image (no such fields in
// CartItemResource) — falls back to the products listing page and a
// placeholder image rather than adding another lookup round trip.
function toCartItem(dto: CartItemDto): CartItem {
  return {
    productId: dto.product_ulid,
    slug: '',
    name: dto.product_name,
    image: '/images/placeholder-product.png',
    price: Number(dto.unit_price),
    quantity: dto.quantity,
  }
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isLoading: boolean
  isAuthenticated: boolean
  addItem: (productUlid: string, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clear: () => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const result = await customerFetchClient<Cart>('/cart')
    if (result.ok) {
      setIsAuthenticated(true)
      setItems(result.data.items.map(toCartItem))
    } else if (result.status === 401) {
      setIsAuthenticated(false)
      setItems([])
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addItem = useCallback(async (productUlid: string, quantity = 1) => {
    const result = await customerFetchClient<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_ulid: productUlid, quantity }),
    })
    if (result.ok) setItems(result.data.items.map(toCartItem))
  }, [])

  const removeItem = useCallback(async (productId: string) => {
    const result = await customerFetchClient<Cart>(`/cart/items/${productId}`, { method: 'DELETE' })
    if (result.ok) setItems(result.data.items.map(toCartItem))
  }, [])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }
    // No PATCH-quantity endpoint — remove then re-add at the new quantity.
    await customerFetchClient(`/cart/items/${productId}`, { method: 'DELETE' })
    const result = await customerFetchClient<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_ulid: productId, quantity }),
    })
    if (result.ok) setItems(result.data.items.map(toCartItem))
  }, [removeItem])

  const clear = useCallback(async () => {
    // No bulk-clear endpoint — remove items one at a time.
    for (const item of items) {
      await customerFetchClient(`/cart/items/${item.productId}`, { method: 'DELETE' })
    }
    setItems([])
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = items.reduce((sum, line) => sum + line.quantity * line.price, 0)
    return { items, count, subtotal, isLoading, isAuthenticated, addItem, removeItem, updateQuantity, clear, refresh: load }
  }, [items, isLoading, isAuthenticated, addItem, removeItem, updateQuantity, clear, load])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
