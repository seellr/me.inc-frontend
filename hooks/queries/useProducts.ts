'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminFetchClient } from '@/lib/admin/api-client'
import type { ApiMeta, ApiResult } from '@/lib/admin/api-server'
import type { CreateProductInput, Product, UpdateProductInput } from '@/types/dto/product.dto'

export const productsQueryKey = (cursor?: string) => ['admin', 'products', cursor ?? null] as const
export const productQueryKey = (ulid: string) => ['admin', 'products', ulid] as const

async function unwrap<T>(pending: Promise<ApiResult<T>>): Promise<T> {
  const result = await pending
  if (!result.ok) throw new Error(result.message)
  return result.data
}

export function useProductsQuery(cursor?: string) {
  return useQuery({
    queryKey: productsQueryKey(cursor),
    queryFn: async () => {
      const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
      const result = await adminFetchClient<Product[]>(`/products${qs}`)
      if (!result.ok) throw new Error(result.message)
      return { items: result.data, meta: result.meta as ApiMeta | undefined }
    },
  })
}

export function useProductQuery(ulid: string) {
  return useQuery({
    queryKey: productQueryKey(ulid),
    queryFn: () => unwrap(adminFetchClient<Product>(`/products/${ulid}`)),
    enabled: ulid !== 'new',
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      adminFetchClient<Product>('/products', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (result) => {
      if (result.ok) queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}

export function useUpdateProduct(ulid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProductInput) =>
      adminFetchClient<Product>(`/products/${ulid}`, { method: 'PUT', body: JSON.stringify(input) }),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.setQueryData(productQueryKey(ulid), result.data)
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      }
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ulid: string) => adminFetchClient<null>(`/products/${ulid}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}
