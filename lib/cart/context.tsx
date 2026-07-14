'use client'

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { CartItem } from '@/types/commerce'

const STORAGE_KEY = 'meinc_cart'

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isLoading: boolean
  isAuthenticated: boolean
  addItem: (productUlid: string, quantity?: number, meta?: Partial<CartItem>) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clear: () => Promise<void>
  refresh: () => Promise<void>
  setAuthenticated: (val: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveToStorage(items)
  }, [items, hydrated])

  const addItem = useCallback(async (productUlid: string, quantity = 1, meta?: Partial<CartItem>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productUlid)
      if (existing) {
        return prev.map((i) =>
          i.productId === productUlid ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          productId: productUlid,
          slug: meta?.slug ?? '',
          name: meta?.name ?? productUlid,
          image: meta?.image ?? null,
          price: meta?.price ?? 0,
          quantity,
        },
      ]
    })
  }, [])

  const removeItem = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }, [])

  const clear = useCallback(async () => {
    setItems([])
  }, [])

  const refresh = useCallback(async () => {}, [])
  const setAuthenticated = useCallback((_val: boolean) => {}, [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = items.reduce((sum, line) => sum + line.quantity * line.price, 0)
    return {
      items,
      count,
      subtotal,
      isLoading: !hydrated,
      isAuthenticated: true,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      refresh,
      setAuthenticated,
    }
  }, [items, hydrated, addItem, removeItem, updateQuantity, clear, refresh, setAuthenticated])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
