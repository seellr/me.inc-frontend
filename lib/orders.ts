import type { Address, CartItem, Order, OrderStage } from '@/types/commerce'

const STORAGE_KEY = 'orders'
const STAGE_SEQUENCE: OrderStage[] = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

function readAll(): Order[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeAll(orders: Order[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function generateOrderNumber() {
  return `ME-${Math.floor(100000 + Math.random() * 900000)}`
}

/**
 * Places a demo order. Since there's no backend, the order is "pre-aged" to a random stage
 * so Order Lookup has something interesting to show immediately.
 */
export function placeOrder(input: {
  email: string
  items: CartItem[]
  subtotal: number
  shipping: number
  address: Address
}): Order {
  const now = Date.now()
  const stageIndex = Math.floor(Math.random() * STAGE_SEQUENCE.length)

  const order: Order = {
    id: crypto.randomUUID(),
    number: generateOrderNumber(),
    email: input.email,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.subtotal + input.shipping,
    address: input.address,
    currentStage: STAGE_SEQUENCE[stageIndex],
    timeline: STAGE_SEQUENCE.map((stage, i) => ({
      stage,
      timestamp: i <= stageIndex ? new Date(now - (stageIndex - i) * 86_400_000).toISOString() : null,
      date: i <= stageIndex ? new Date(now - (stageIndex - i) * 86_400_000).toLocaleDateString() : '',
      completed: i <= stageIndex,
    })),
    createdAt: new Date(now).toISOString(),
  }

  writeAll([...readAll(), order])
  return order
}

export function findOrder(number: string, email: string): Order | null {
  const normalized = number.trim().toUpperCase()
  const emailNormalized = email.trim().toLowerCase()
  return (
    readAll().find(
      (o) => o.number.toUpperCase() === normalized && o.email?.toLowerCase() === emailNormalized
    ) ?? null
  )
}
