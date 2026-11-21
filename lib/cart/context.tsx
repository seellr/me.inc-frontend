'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CartItem, CartCoupon, CartSummaryData } from '@/types/commerce'
import * as cartApi from './api'
import { getOrCreateGuestToken, getGuestToken } from './guest-token'

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: string | number
  discount: string | number
  vat: string | number
  vatLabel: string | null
  total: string | number
  coupon: CartCoupon | null
  currency: string
  isLoading: boolean
  loadError: string | null
  isAuthenticated: boolean
  requiresShipping: boolean
  addItem: (productUlid: string, quantity?: number) => Promise<{ error?: string }>
  removeItem: (productUlid: string) => Promise<void>
  updateQuantity: (productUlid: string, quantity: number) => Promise<void>
  applyCoupon: (code: string) => Promise<{ error?: string }>
  removeCoupon: () => Promise<void>
  clear: () => Promise<void>
  refresh: () => Promise<void>
  setAuthenticated: (val: boolean) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const EMPTY_SUMMARY: CartSummaryData = {
  items: [],
  coupon: null,
  subtotal: '0',
  discount_amount: '0',
  vat_amount: '0',
  vat_label: null,
  total: '0',
  currency: 'SAR',
}

async function load(auth: boolean): Promise<{
  cart: cartApi.CartData | null
  summary: cartApi.CartData | null
  error: string | null
}> {
  if (!auth) {
    const cart = await cartApi.getCart(false)
    return {
      cart: cart.ok ? cart.data : null,
      summary: null,
      error: cart.ok ? null : cart.message,
    }
  }

  const [cartRes, summaryRes] = await Promise.all([
    cartApi.getCart(true),
    cartApi.getSummary(true),
  ])

  return {
    cart: cartRes.ok ? cartRes.data : null,
    summary: summaryRes.ok ? summaryRes.data : null,
    error: !cartRes.ok ? cartRes.message : !summaryRes.ok ? summaryRes.message : null,
  }
}

export function CartProvider({
  children,
  initialAuthenticated = false,
}: {
  children: React.ReactNode
  initialAuthenticated?: boolean
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CartSummaryData>(EMPTY_SUMMARY)
  const [coupon, setCoupon] = useState<CartCoupon | null>(null)
  const [currency, setCurrency] = useState('SAR')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated)
  const mountedRef = useRef(true)
  const mergedRef = useRef(false)

  const loadCart = useCallback(async (auth: boolean) => {
    setIsLoading(true)
    const result = await load(auth)
    if (!mountedRef.current) return

    const source = result.summary ?? result.cart
    if (source) {
      setItems(source.items)
      setSummary(source)
      setCoupon(source.coupon)
      setCurrency(source.currency)
    } else {
      setItems([])
      setSummary(EMPTY_SUMMARY)
      setCoupon(null)
    }
    setLoadError(result.error)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const init = async () => {
      if (isAuthenticated) {
        if (!mergedRef.current && getGuestToken()) {
          mergedRef.current = true
          // Never fail the session because the merge failed.
          await cartApi.mergeGuestCart().catch(() => undefined)
        }
      } else {
        getOrCreateGuestToken()
      }
      await loadCart(isAuthenticated)
    }
    init()
    return () => {
      mountedRef.current = false
    }
  }, [isAuthenticated, loadCart])

  const addItem = useCallback(
    async (productUlid: string, quantity = 1): Promise<{ error?: string }> => {
      const res = await cartApi.addItem(isAuthenticated, productUlid, quantity)
      if (!res.ok) {
        if (res.errorCode === 'product_not_purchasable') {
          return { error: 'product_not_purchasable' }
        }
        if (res.errorCode === 'cart_lock_failed') {
          return { error: 'cart_lock_failed' }
        }
        return { error: res.message || 'Failed to add item' }
      }
      await loadCart(isAuthenticated)
      return {}
    },
    [isAuthenticated, loadCart],
  )

  const removeItem = useCallback(
    async (productUlid: string) => {
      await cartApi.removeItem(isAuthenticated, productUlid)
      await loadCart(isAuthenticated)
    },
    [isAuthenticated, loadCart],
  )

  const updateQuantity = useCallback(
    async (productUlid: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productUlid)
        return
      }
      const clamped = Math.min(10, Math.max(1, quantity))
      await cartApi.removeItem(isAuthenticated, productUlid)
      await cartApi.addItem(isAuthenticated, productUlid, clamped)
      await loadCart(isAuthenticated)
    },
    [isAuthenticated, loadCart, removeItem],
  )

  const applyCoupon = useCallback(
    async (code: string): Promise<{ error?: string }> => {
      const res = await cartApi.applyCoupon(isAuthenticated, code)
      if (!res.ok) {
        if (res.errorCode === 'coupon_product_not_found') {
          return { error: 'coupon_not_found' }
        }
        if (res.errorCode === 'coupon_not_applicable') {
          return { error: res.message || 'coupon_not_applicable' }
        }
        if (res.errorCode === 'cart_empty' || res.errorCode === 'checkout_cart_empty') {
          return { error: 'cart_empty' }
        }
        return { error: res.message || 'Failed to apply coupon' }
      }
      await loadCart(isAuthenticated)
      return {}
    },
    [isAuthenticated, loadCart],
  )

  const removeCoupon = useCallback(async () => {
    await cartApi.removeCoupon(isAuthenticated)
    await loadCart(isAuthenticated)
  }, [isAuthenticated, loadCart])

  const clear = useCallback(async () => {
    for (const item of items) {
      await cartApi.removeItem(isAuthenticated, item.productId)
    }
    await loadCart(isAuthenticated)
  }, [isAuthenticated, items, loadCart])

  const refresh = useCallback(async () => {
    await loadCart(isAuthenticated)
  }, [isAuthenticated, loadCart])

  const setAuthenticated = useCallback(
    async (val: boolean) => {
      if (val && !isAuthenticated) {
        setIsAuthenticated(true)
        if (!mergedRef.current && getGuestToken()) {
          mergedRef.current = true
          await cartApi.mergeGuestCart().catch(() => undefined)
        }
        await loadCart(true)
        return
      }
      if (!val) {
        mergedRef.current = false
        setIsAuthenticated(false)
        await loadCart(false)
      }
    },
    [isAuthenticated, loadCart],
  )

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0)
    const requiresShipping = items.some((line) => line.requiresShipping)

    return {
      items,
      count,
      subtotal: summary.subtotal,
      discount: summary.discount_amount,
      vat: summary.vat_amount,
      vatLabel: summary.vat_label,
      total: summary.total,
      coupon,
      currency,
      isLoading,
      loadError,
      isAuthenticated,
      requiresShipping,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clear,
      refresh,
      setAuthenticated,
    }
  }, [
    items,
    summary,
    coupon,
    currency,
    isLoading,
    loadError,
    isAuthenticated,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clear,
    refresh,
    setAuthenticated,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
