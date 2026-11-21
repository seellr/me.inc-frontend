'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ApiResult } from '@/lib/api/types'
import {
  decideFunnel,
  getDelivery,
  getFunnelNextStep,
  getOrder,
  getShippingMethods,
  trackShipment,
} from '@/lib/orders/api'
import { storeFetchClient } from '@/lib/customer/api-client'
import { SearchProductsResponseSchema } from '@/types/dto/storefront.dto'
import { mapProduct } from '@/lib/store/product-mapper'
import type {
  CustomerOrderView,
  DeliveryView,
  FunnelStepView,
  ShipmentTrackView,
  ShippingMethodView,
  StoreProduct,
} from '@/types/commerce'

const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS = 60_000

function isPendingStatus(statusId: number | null): boolean {
  return statusId === 1 || statusId === 5
}

export function useOrderPolling(ulid: string, initialOrder: CustomerOrderView | null) {
  const [order, setOrder] = useState<CustomerOrderView | null>(initialOrder)
  const [isLoading, setIsLoading] = useState(!initialOrder)
  const [isPolling, setIsPolling] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pollToken, setPollToken] = useState(0)
  const orderRef = useRef<CustomerOrderView | null>(initialOrder)

  orderRef.current = order

  const refresh = useCallback(async (): Promise<ApiResult<CustomerOrderView>> => {
    const result = await getOrder(ulid)
    if (result.ok) {
      setOrder(result.data)
      orderRef.current = result.data
      setError(null)
    } else {
      setError(result.message)
    }
    return result
  }, [ulid])

  useEffect(() => {
    if (initialOrder) return
    setIsLoading(true)
    void refresh().finally(() => setIsLoading(false))
  }, [initialOrder, refresh])

  useEffect(() => {
    const current = orderRef.current
    if (!current || !isPendingStatus(current.statusId)) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const startedAt = Date.now()

    setIsPolling(true)
    setTimedOut(false)

    const tick = async () => {
      if (cancelled) return
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setTimedOut(true)
        setIsPolling(false)
        return
      }

      const result = await getOrder(ulid)
      if (cancelled) return

      if (result.ok) {
        setOrder(result.data)
        orderRef.current = result.data
        setError(null)
        if (!isPendingStatus(result.data.statusId)) {
          setIsPolling(false)
          return
        }
      } else {
        setError(result.message)
      }

      timer = setTimeout(tick, POLL_INTERVAL_MS)
    }

    timer = setTimeout(tick, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      setIsPolling(false)
    }
  }, [ulid, pollToken, initialOrder])

  const retryPolling = useCallback(() => {
    setPollToken((token) => token + 1)
  }, [])

  return {
    order,
    isLoading,
    isPolling,
    timedOut,
    error,
    refresh,
    retryPolling,
  }
}

export function useDelivery(productUlid: string | null, enabled = true) {
  const [delivery, setDelivery] = useState<DeliveryView | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const load = useCallback(
    async (retryOnce: boolean): Promise<void> => {
      if (!productUlid) return
      setIsLoading(true)
      setError(null)
      setErrorCode(null)

      let result = await getDelivery(productUlid)

      // The delivery record may not exist yet right after payment.
      if (!result.ok && result.status === 404 && retryOnce) {
        await new Promise((resolve) => setTimeout(resolve, 2_000))
        result = await getDelivery(productUlid)
      }

      if (result.ok) {
        setDelivery(result.data)
      } else {
        setError(result.message)
        setErrorCode(result.errorCode)
      }
      setIsLoading(false)
    },
    [productUlid],
  )

  useEffect(() => {
    if (!enabled || !productUlid) return
    void load(true)
  }, [enabled, productUlid, load])

  return { delivery, isLoading, error, errorCode, reload: () => load(false) }
}

export function useShipmentTracking(shipmentUlid: string | null, enabled = true) {
  const [shipment, setShipment] = useState<ShipmentTrackView | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !shipmentUlid) return
    let cancelled = false
    setIsLoading(true)
    void trackShipment(shipmentUlid).then((result) => {
      if (cancelled) return
      if (result.ok) setShipment(result.data)
      else setError(result.message)
      setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [enabled, shipmentUlid])

  return { shipment, isLoading, error }
}

export function useShippingMethods() {
  const [methods, setMethods] = useState<ShippingMethodView[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void getShippingMethods().then((result) => {
      if (cancelled) return
      if (result.ok) setMethods(result.data)
      else setError(result.message)
      setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { methods, isLoading, error }
}

export function useFunnelNextStep(orderUlid: string, initialStep: FunnelStepView | null) {
  const [step, setStep] = useState<FunnelStepView | null>(initialStep)
  const [isLoading, setIsLoading] = useState(!initialStep)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [throttled, setThrottled] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    const result = await getFunnelNextStep(orderUlid)
    if (result.ok) setStep(result.data)
    else setError(result.message)
    setIsLoading(false)
  }, [orderUlid])

  useEffect(() => {
    if (!initialStep) void load()
  }, [initialStep, load])

  const decide = useCallback(
    async (accepted: boolean): Promise<void> => {
      if (!step || step.step === 'complete' || step.step === 'dashboard') return
      setIsPending(true)
      setError(null)
      setThrottled(false)

      const result = await decideFunnel(
        orderUlid,
        step.step === 'oto' ? 'oto' : 'downsell',
        accepted,
      )

      if (result.ok) {
        setStep(result.data)
      } else if (result.status === 429) {
        setThrottled(true)
        setError(result.message)
      } else {
        setError(result.message)
      }
      setIsPending(false)
    },
    [orderUlid, step],
  )

  return { step, isLoading, isPending, error, throttled, decide, reload: load }
}

export function useProductSearch(query: string, perPage = 20) {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ has_more?: boolean; next_cursor?: string | null } | null>(
    null,
  )

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setProducts([])
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    const timer = setTimeout(() => {
      const params = new URLSearchParams({ q: trimmed, per_page: String(Math.min(perPage, 50)) })
      void storeFetchClient<unknown>(`/search/products?${params.toString()}`, {
        schema: SearchProductsResponseSchema,
      }).then((result) => {
        if (cancelled) return
        if (result.ok) {
          const raw = result.data
          const list = Array.isArray(raw)
            ? raw
            : ((raw as { products?: unknown[]; data?: unknown[] }).products ??
              (raw as { data?: unknown[] }).data ??
              [])
          setProducts(list.map((item) => mapProduct(item as never)))
          setMeta((result.meta as typeof meta) ?? null)
          setError(null)
        } else {
          setError(result.message)
        }
        setIsLoading(false)
      })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, perPage])

  return { products, isLoading, error, meta }
}
