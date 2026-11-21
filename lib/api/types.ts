export interface ApiMeta {
  per_page?: number
  next_cursor?: string | null
  has_more?: boolean
  [key: string]: unknown
}

export interface ApiSuccess<T> {
  ok: true
  data: T
  meta?: ApiMeta
  status: number
}

export interface ApiFailure {
  ok: false
  message: string
  errorCode: string
  errors: Record<string, string[]> | null
  status: number
  retryAfter?: number
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure

export function isApiFailure<T>(result: ApiResult<T>): result is ApiFailure {
  return !result.ok
}
