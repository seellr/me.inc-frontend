'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem } from '@/types/commerce'

const STORAGE_KEY = 'cart'

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variant?: string) => void
  updateQuantity: (productId: string, quantity: number, variant?: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function sameLine(a: CartItem, productId: string, variant?: string) {
  return a.productId === productId && a.variant === variant
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        // ignore malformed cart in storage
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((line) => sameLine(line, item.productId, item.variant))
      if (existing) {
        return prev.map((line) =>
          sameLine(line, item.productId, item.variant)
            ? { ...line, quantity: line.quantity + item.quantity }
            : line
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: string, variant?: string) => {
    setItems((prev) => prev.filter((line) => !sameLine(line, productId, variant)))
  }

  const updateQuantity = (productId: string, quantity: number, variant?: string) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((line) => !sameLine(line, productId, variant))
        : prev.map((line) => (sameLine(line, productId, variant) ? { ...line, quantity } : line))
    )
  }

  const clear = () => setItems([])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = items.reduce((sum, line) => sum + line.quantity * line.price, 0)
    return { items, count, subtotal, addItem, removeItem, updateQuantity, clear }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
