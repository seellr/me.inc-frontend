import type { ApiResult } from '@/lib/api/types'

export type CartErrorCode =
  | 'guest_token_required'
  | 'product_not_purchasable'
  | 'coupon_product_not_found'
  | 'coupon_not_applicable'
  | 'cart_empty'
  | 'checkout_cart_empty'
  | 'cart_lock_failed'

const RETRY_DELAY_MS = 500
const MAX_LOCK_RETRIES = 3

/**
 * Cart mutations can fail with 409 cart_lock_failed when another request holds
 * the cart lock. Retry with linear backoff; everything else is returned as-is.
 */
export async function withCartLockRetry<T>(
  fn: () => Promise<ApiResult<T>>,
  retries = MAX_LOCK_RETRIES,
): Promise<ApiResult<T>> {
  let result = await fn()

  for (let attempt = 1; attempt <= retries; attempt++) {
    const retryable =
      !result.ok &&
      (result.errorCode === 'cart_lock_failed' ||
        result.errorCode === 'cart_locked' ||
        result.status === 409)
    if (!retryable) return result

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
    result = await fn()
  }

  return result
}
