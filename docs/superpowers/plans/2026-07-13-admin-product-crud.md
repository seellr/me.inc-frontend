# Admin Dashboard Port + Product CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the admin dashboard route group inside meinc with a working httpOnly-cookie auth flow, and ship full product CRUD (list, create, edit, delete) for the core product fields against the real backend `/v1/admin/products` endpoints.

**Architecture:** Storefront routes move into a new `(storefront)` route group so `(admin)` can be a sibling with no Navbar/Footer chrome. Auth token stays in an httpOnly cookie (`token_admin`), readable only server-side. Server Components (`page.tsx`) call Laravel directly using the cookie. Client Components (forms, mutations) never see the token — they call a same-origin Next.js Route Handler proxy (`/api/admin/[...path]`) that reads the cookie server-side and forwards to Laravel. React Query owns all client-side data (hydrated from the server-fetched initial data, refetched/mutated via the proxy). Zod schemas in `types/dto/product.dto.ts` are the single source of truth for both the API contract and `react-hook-form` validation.

**Tech Stack:** Next.js 16.2.10 (App Router, async `params`), TypeScript, `@tanstack/react-query` 5, `zod` 4, `react-hook-form` 7, `framer-motion`, shadcn (Base UI primitives, `components.json` already has `"rtl": true`), `next-intl`, `sileo` (toasts).

## Global Constraints

- `page.tsx` is always a Server Component. Interactivity lives in `*Client.tsx` Client Components.
- DTOs: one file per domain under `types/dto/`, zod schema + inferred type, shared by the API layer, react-query hooks, and forms.
- Data layer: `lib/admin/api-server.ts` (Server Components, direct-to-Laravel) + `lib/admin/api-client.ts` (Client Components, same-origin proxy) + `hooks/queries/use{Domain}.ts` (react-query wrappers).
- No directional Tailwind classes (`pl-/pr-/ml-/mr-/left-/right-/text-left/text-right`) in any new code — logical equivalents only (`ps-/pe-/ms-/me-/start-/end-/text-start/text-end`), matching the existing `components/ui/button.tsx` convention.
- Base UI's `DirectionProvider` (`@base-ui/react/direction-provider`) must wrap the app alongside `dir` on `<html>` — without it, Select/Dialog/Popover/Sidebar position incorrectly under RTL even with `"rtl": true` in `components.json`. Per shadcn's own RTL docs, Sidebar (including its `side` prop) requires manual RTL handling — the automatic CLI transform doesn't cover it. Directional icons still need `rtl:rotate-180` explicitly.
- Validation messages resolved via `useTranslations`, never hardcoded strings, via schema factory functions.
- Route-level loading: skeleton via `loading.tsx`. Button-level: inline spinner during `useMutation().isPending`. Field errors: inlined under inputs. Success/failure: `sileo` toasts.
- This Next.js version renamed `middleware.ts` to `proxy.ts` — do not create a `middleware.ts` file; the existing `proxy.ts` (next-intl locale routing) is untouched by this plan.
- `params` in `page.tsx`/`layout.tsx` is a `Promise` — always `await params`.
- Component files: PascalCase. Non-component files: camelCase. Any file with `'use client'` at the top gets a `Client` suffix.
- Commit messages: Conventional Commits (`feat(admin): ...`, `refactor(storefront): ...`).

---

## Task 1: Restructure storefront into `(storefront)` route group

**Files:**
- Modify: `app/[locale]/layout.tsx`
- Create: `app/[locale]/(storefront)/layout.tsx`
- Move: `app/[locale]/page.tsx` → `app/[locale]/(storefront)/page.tsx`
- Move: `app/[locale]/products/` → `app/[locale]/(storefront)/products/`
- Move: `app/[locale]/cart/` → `app/[locale]/(storefront)/cart/`
- Move: `app/[locale]/checkout/` → `app/[locale]/(storefront)/checkout/`
- Move: `app/[locale]/orders/` → `app/[locale]/(storefront)/orders/`

**Interfaces:**
- Produces: a slim root `[locale]/layout.tsx` (html/body/`NextIntlClientProvider`/`Toaster` only) so `(admin)` (Task 9) can be a sibling of `(storefront)` without inheriting Navbar/Footer/`CartProvider`.

- [ ] **Step 1: Move the route files**

```bash
mkdir -p "app/[locale]/(storefront)"
git mv "app/[locale]/page.tsx" "app/[locale]/(storefront)/page.tsx"
git mv "app/[locale]/products" "app/[locale]/(storefront)/products"
git mv "app/[locale]/cart" "app/[locale]/(storefront)/cart"
git mv "app/[locale]/checkout" "app/[locale]/(storefront)/checkout"
git mv "app/[locale]/orders" "app/[locale]/(storefront)/orders"
```

- [ ] **Step 2: Create the storefront layout**

Create `app/[locale]/(storefront)/layout.tsx` — this takes over the chrome the root layout used to own:

```tsx
import { SmoothScroll } from '@/components/smooth-scroll'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartProvider } from '@/lib/cart/context'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SmoothScroll>
        <Navbar />
        {children}
        <Footer />
      </SmoothScroll>
    </CartProvider>
  )
}
```

- [ ] **Step 3: Slim the root layout**

Modify `app/[locale]/layout.tsx` — remove `CartProvider`/`SmoothScroll`/`Navbar`/`Footer` imports and usage, keep everything else identical:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Toaster } from 'sileo'
import { DirectionProvider } from '@base-ui/react/direction-provider'
import '../globals.css'
import { cn } from '@/lib/utils'
import { chillax, thmanyah } from '@/lib/fonts'
import { routing } from '@/i18n/routing'

const DIRECTION: Record<string, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' }

export const metadata: Metadata = {
  title: 'me.inc',
  description: 'me.inc',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={DIRECTION[locale]}
      className={cn('h-full', 'antialiased', 'font-sans', chillax.variable, thmanyah.variable)}
    >
      <body className="min-h-full flex flex-col">
        <DirectionProvider direction={DIRECTION[locale]}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </DirectionProvider>
      </body>
      <Toaster position="top-right" />
    </html>
  )
}
```

- [ ] **Step 4: Verify the storefront still builds and routes**

Run: `npm run build`
Expected: build succeeds, no missing-module errors for the moved files (Next.js resolves route groups by folder name in parens — URLs are unaffected: `/ar`, `/ar/products`, `/ar/cart`, `/ar/checkout`, `/ar/orders` all still resolve, just now served from `(storefront)`).

Run: `npm run dev` (in background), then check in the browser that `/ar` renders the homepage with Navbar/Footer visible.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/layout.tsx" "app/[locale]/(storefront)"
git commit -m "refactor(storefront): move storefront routes into (storefront) route group

Root [locale]/layout.tsx no longer hardcodes Navbar/Footer/CartProvider,
so the upcoming (admin) route group can be a sibling without inheriting
storefront chrome."
```

---

## Task 2: Add missing shadcn UI primitives

**Files:**
- Create (via CLI, not hand-written): `components/ui/table.tsx`, `components/ui/form.tsx`, `components/ui/tabs.tsx`, `components/ui/select.tsx`, `components/ui/switch.tsx`, `components/ui/skeleton.tsx`, `components/ui/sidebar.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/label.tsx`, `components/ui/textarea.tsx`

**Interfaces:**
- Produces: shadcn primitives consumed by `AdminShell.tsx` (Task 9), `ProductsTableClient.tsx` (Task 10), `ProductFormClient.tsx` (Task 11).

- [ ] **Step 1: Run the shadcn CLI**

Run (from `meinc/`):
```bash
npx shadcn@latest add table form tabs select switch skeleton sidebar dropdown-menu label textarea
```
Expected: each component is added to `components/ui/`, matching the project's existing `"style": "base-luma"` / Base UI convention (already configured in `components.json`). Answer any CLI prompts with the defaults (project's existing config is auto-detected from `components.json`).

- [ ] **Step 2: Verify they compile**

Run: `npx tsc --noEmit`
Expected: no type errors from the newly added files.

- [ ] **Step 3: Commit**

```bash
git add components/ui/table.tsx components/ui/form.tsx components/ui/tabs.tsx components/ui/select.tsx components/ui/switch.tsx components/ui/skeleton.tsx components/ui/sidebar.tsx components/ui/dropdown-menu.tsx components/ui/label.tsx components/ui/textarea.tsx
git commit -m "chore(ui): add table, form, tabs, select, switch, skeleton, sidebar, dropdown-menu, label, textarea via shadcn CLI"
```

---

## Task 3: Admin auth — cookie helpers + login flow

**Files:**
- Create: `lib/admin/auth.ts`
- Create: `app/api/admin/auth/login/route.ts`
- Create: `app/api/admin/auth/logout/route.ts`
- Create: `types/dto/auth.dto.ts`

**Interfaces:**
- Consumes: `POST /v1/admin/auth/login` (backend, public, body `{ identifier, password }` — matches `LoginRequest` pattern in the backend's Auth module; returns a `token` field in `data`).
- Produces: `setAdminTokenCookie(token: string): void`, `getAdminTokenCookie(): Promise<string | null>`, `clearAdminTokenCookie(): void` (all server-only, used by Task 4's `api-server.ts` and by the Route Handlers below).

- [ ] **Step 1: DTO for login**

Create `types/dto/auth.dto.ts`:

```ts
import { z } from 'zod'

export const AdminLoginRequestSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(8).max(128),
})
export type AdminLoginRequest = z.infer<typeof AdminLoginRequestSchema>

export const AdminLoginResponseSchema = z.object({
  token: z.string(),
  admin: z.object({
    ulid: z.string(),
    name: z.string(),
    email: z.string(),
  }),
})
export type AdminLoginResponse = z.infer<typeof AdminLoginResponseSchema>
```

- [ ] **Step 2: Cookie helpers (server-only)**

Create `lib/admin/auth.ts`:

```ts
import 'server-only'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'token_admin'
const MAX_AGE_SECONDS = 60 * 60 * 8 // 8h, matches typical Sanctum token TTL patterns

export async function setAdminTokenCookie(token: string): Promise<void> {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function getAdminTokenCookie(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export async function clearAdminTokenCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
```

- [ ] **Step 3: Login Route Handler**

Create `app/api/admin/auth/login/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { AdminLoginRequestSchema, AdminLoginResponseSchema } from '@/types/dto/auth.dto'
import { setAdminTokenCookie } from '@/lib/admin/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = AdminLoginRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid request', errors: parsed.error.flatten() }, { status: 422 })
  }

  const res = await fetch(`${API_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(parsed.data),
  })
  const json = await res.json()

  if (!res.ok || !json.success) {
    return NextResponse.json(
      { success: false, message: json.message ?? 'Login failed', error_code: json.error_code ?? 'login_failed' },
      { status: res.status },
    )
  }

  const data = AdminLoginResponseSchema.parse(json.data)
  await setAdminTokenCookie(data.token)

  return NextResponse.json({ success: true, data: { admin: data.admin } })
}
```

- [ ] **Step 4: Logout Route Handler**

Create `app/api/admin/auth/logout/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { clearAdminTokenCookie } from '@/lib/admin/auth'

export async function POST() {
  await clearAdminTokenCookie()
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors in the four new files.

- [ ] **Step 6: Commit**

```bash
git add lib/admin/auth.ts app/api/admin/auth types/dto/auth.dto.ts
git commit -m "feat(admin): add httpOnly cookie auth helpers and login/logout route handlers"
```

---

## Task 4: Admin data layer — server fetch, client proxy, product DTO

**Files:**
- Create: `lib/admin/api-server.ts`
- Create: `lib/admin/api-client.ts`
- Create: `app/api/admin/[...path]/route.ts`
- Create: `types/dto/product.dto.ts`

**Interfaces:**
- Consumes: `getAdminTokenCookie()` (Task 3).
- Produces: `adminFetchServer<T>(path: string, init?: RequestInit): Promise<ApiResult<T>>` (Server Components), `adminFetchClient<T>(path: string, init?: RequestInit): Promise<ApiResult<T>>` (Client Components, hits `/api/admin/*`), `ApiResult<T>` / `ApiMeta` types, `ProductSchema` / `ProductListItemSchema` / `CreateProductSchema` / `UpdateProductSchema` and their inferred types — consumed by `hooks/queries/useProducts.ts` (Task 5) and both product pages (Tasks 10-11).

- [ ] **Step 1: Shared API result types + server fetch**

Create `lib/admin/api-server.ts`:

```ts
import 'server-only'
import { getAdminTokenCookie } from '@/lib/admin/auth'
import { getLocale } from 'next-intl/server'

export interface ApiMeta {
  per_page: number
  next_cursor: string | null
  has_more: boolean
}

export interface ApiSuccess<T> {
  ok: true
  data: T
  meta?: ApiMeta
}

export interface ApiFailure {
  ok: false
  message: string
  errorCode: string
  errors: Record<string, string[]> | null
  status: number
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

export async function adminFetchServer<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const token = await getAdminTokenCookie()
  const locale = await getLocale()

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'Accept-Language': locale,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    },
    cache: 'no-store',
  })

  const json = await res.json().catch(() => null)

  if (!res.ok || !json?.success) {
    return {
      ok: false,
      message: json?.message ?? `Request failed (${res.status})`,
      errorCode: json?.error_code ?? 'unknown_error',
      errors: json?.errors ?? null,
      status: res.status,
    }
  }

  return { ok: true, data: json.data as T, meta: json.meta }
}
```

- [ ] **Step 2: Client fetch (same-origin proxy)**

Create `lib/admin/api-client.ts`:

```ts
'use client'

import type { ApiResult } from '@/lib/admin/api-server'

export async function adminFetchClient<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const signal = init?.signal ?? controller.signal

  try {
    const res = await fetch(`/api/admin${path}`, {
      ...init,
      signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(init?.headers as Record<string, string> | undefined),
      },
    })
    const json = await res.json().catch(() => null)

    if (!res.ok || !json?.success) {
      return {
        ok: false,
        message: json?.message ?? `Request failed (${res.status})`,
        errorCode: json?.error_code ?? 'unknown_error',
        errors: json?.errors ?? null,
        status: res.status,
      }
    }

    return { ok: true, data: json.data as T, meta: json.meta }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    return { ok: false, message: 'Network error', errorCode: 'network_error', errors: null, status: 0 }
  }
}
```

- [ ] **Step 3: Catch-all proxy Route Handler**

Create `app/api/admin/[...path]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getAdminTokenCookie } from '@/lib/admin/auth'
import { getLocale } from 'next-intl/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const token = await getAdminTokenCookie()

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthenticated', error_code: 'unauthenticated' }, { status: 401 })
  }

  const locale = await getLocale()
  const search = request.nextUrl.search
  const targetUrl = `${API_URL}/admin/${path.join('/')}${search}`

  const body = request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text()

  const res = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'Accept-Language': locale,
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  if (res.status === 401) {
    return NextResponse.json({ success: false, message: 'Unauthenticated', error_code: 'unauthenticated' }, { status: 401 })
  }

  const json = await res.json().catch(() => ({}))
  return NextResponse.json(json, { status: res.status })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
```

- [ ] **Step 4: Product DTO**

Create `types/dto/product.dto.ts`:

```ts
import { z } from 'zod'

export const ProductTypeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const
export const ProductTypeLabels: Record<number, string> = {
  1: 'Ebook', 2: 'Template', 3: 'Playbook', 4: 'Notion System', 5: 'Prompts Pack',
  6: 'Bundle', 7: 'Course', 8: 'AI Tool', 9: 'Quiz', 10: 'Audio', 11: 'Membership',
  12: 'Challenge', 13: 'Consultation',
}

const EnumLabelSchema = z.object({ id: z.number(), label: z.string() })

export const ProductTranslationSchema = z.object({
  name: z.string().min(1).max(200),
  one_liner: z.string().max(300).nullable().optional(),
})

export const ProductTranslationsSchema = z.object({
  ar: ProductTranslationSchema,
  en: ProductTranslationSchema.partial().optional(),
})

// ── Response shape (GET) ────────────────────────────────────────────────────
export const ProductSchema = z.object({
  ulid: z.string(),
  slug: z.string(),
  brand_id: z.number().nullable(),
  internal_name: z.string(),
  sku: z.string(),
  type: EnumLabelSchema,
  status: EnumLabelSchema.nullable(),
  base_price: z.union([z.string(), z.number()]),
  sale_price: z.union([z.string(), z.number()]).nullable(),
  currency: z.string(),
  vat_rule: EnumLabelSchema,
  coupon_eligible: z.boolean(),
  hero_image_url: z.string().nullable(),
  delivery_method: EnumLabelSchema,
  featured: z.boolean(),
  name: z.string(),
  one_liner: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Product = z.infer<typeof ProductSchema>

export const ProductListSchema = z.array(ProductSchema)

// ── Write shapes (POST/PUT) ─────────────────────────────────────────────────
export const CreateProductSchema = z.object({
  brand_id: z.number().int().min(1).nullable().optional(),
  internal_name: z.string().min(1).max(200),
  type: z.number().refine((v) => (ProductTypeValues as readonly number[]).includes(v), 'invalid_type'),
  delivery_method: z.number().int(),
  base_price: z.number().min(0).max(999999.99),
  sale_price: z.number().min(0).optional(),
  currency: z.string().length(3),
  vat_rule: z.number().int(),
  sku: z.string().max(80).regex(/^[A-Za-z0-9\-_]+$/, 'invalid_sku'),
  coupon_eligible: z.boolean(),
  featured: z.boolean(),
  translations: ProductTranslationsSchema,
})
export type CreateProductInput = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = CreateProductSchema.omit({ brand_id: true }).extend({
  status: z.number().int().optional(),
})
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
```

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/admin/api-server.ts lib/admin/api-client.ts app/api/admin types/dto/product.dto.ts
git commit -m "feat(admin): add server/client data layer and product DTO schemas"
```

---

## Task 5: React Query hooks for products

**Files:**
- Create: `hooks/queries/useProducts.ts`
- Create: `lib/admin/query-client.ts`

**Interfaces:**
- Consumes: `adminFetchClient` (Task 4), `Product`/`CreateProductInput`/`UpdateProductInput`/`ApiMeta` (Task 4).
- Produces: `useProductsQuery(cursor?: string)`, `useProductQuery(ulid: string)`, `useCreateProduct()`, `useUpdateProduct(ulid: string)`, `useDeleteProduct()` — consumed by `ProductsTableClient.tsx` (Task 10) and `ProductFormClient.tsx` (Task 11). `getQueryClient()` — consumed by `(admin)/layout.tsx` (Task 9) and both product `page.tsx` files (Tasks 10-11) for hydration.

- [ ] **Step 1: Query client factory**

Create `lib/admin/query-client.ts`:

```ts
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// One QueryClient per request on the server (React `cache()` dedupes within
// a single render pass), a module-singleton in the browser.
export const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, retry: 1 },
  },
}))
```

- [ ] **Step 2: Product hooks**

Create `hooks/queries/useProducts.ts`:

```ts
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminFetchClient } from '@/lib/admin/api-client'
import type { ApiMeta, ApiResult } from '@/lib/admin/api-server'
import type { CreateProductInput, Product, UpdateProductInput } from '@/types/dto/product.dto'

export const productsQueryKey = (cursor?: string) => ['admin', 'products', cursor ?? null] as const
export const productQueryKey = (ulid: string) => ['admin', 'products', ulid] as const

async function unwrap<T>(result: ApiResult<T>): Promise<T> {
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
      unwrap(adminFetchClient<Product>('/products', { method: 'POST', body: JSON.stringify(input) })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}

export function useUpdateProduct(ulid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProductInput) =>
      unwrap(adminFetchClient<Product>(`/products/${ulid}`, { method: 'PUT', body: JSON.stringify(input) })),
    onSuccess: (product) => {
      queryClient.setQueryData(productQueryKey(ulid), product)
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
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
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add hooks/queries/useProducts.ts lib/admin/query-client.ts
git commit -m "feat(admin): add react-query hooks for product list/detail/create/update/delete"
```

---

## Task 6: Admin i18n namespace

**Files:**
- Create: `messages/ar/admin.json`
- Create: `messages/en/admin.json`
- Modify: `i18n/request.ts`

**Interfaces:**
- Produces: `admin.*` translation keys — consumed by `AdminShell.tsx` (Task 9), `ProductFormClient.tsx` (Task 11), login page (Task 9).

- [ ] **Step 1: English messages**

Create `messages/en/admin.json`:

```json
{
  "nav": {
    "dashboard": "Dashboard",
    "products": "Products",
    "logout": "Log out"
  },
  "login": {
    "title": "Admin Login",
    "identifier": "Email or phone",
    "password": "Password",
    "submit": "Log in",
    "error": "Invalid credentials"
  },
  "products": {
    "title": "Products",
    "new": "New Product",
    "empty": "No products yet",
    "table": {
      "name": "Name",
      "sku": "SKU",
      "type": "Type",
      "price": "Price",
      "status": "Status",
      "actions": "Actions"
    },
    "form": {
      "internalName": "Internal name",
      "nameAr": "Name (Arabic)",
      "nameEn": "Name (English)",
      "oneLinerAr": "One-liner (Arabic)",
      "oneLinerEn": "One-liner (English)",
      "type": "Type",
      "sku": "SKU",
      "basePrice": "Base price",
      "salePrice": "Sale price",
      "currency": "Currency",
      "vatRule": "VAT rule",
      "deliveryMethod": "Delivery method",
      "couponEligible": "Coupon eligible",
      "featured": "Featured",
      "save": "Save",
      "saveSuccess": "Product saved",
      "saveError": "Could not save product",
      "deleteConfirmTitle": "Delete this product?",
      "deleteConfirmBody": "This cannot be undone.",
      "deleteConfirm": "Delete",
      "deleteCancel": "Cancel",
      "deleteSuccess": "Product deleted",
      "deleteError": "Could not delete product"
    },
    "validation": {
      "nameRequired": "Name is required",
      "nameTooLong": "Name is too long",
      "typeInvalid": "Select a valid product type",
      "skuInvalid": "SKU can only contain letters, numbers, - and _",
      "priceInvalid": "Enter a valid price",
      "currencyInvalid": "Currency must be 3 letters"
    }
  }
}
```

- [ ] **Step 2: Arabic messages**

Create `messages/ar/admin.json`:

```json
{
  "nav": {
    "dashboard": "لوحة التحكم",
    "products": "المنتجات",
    "logout": "تسجيل الخروج"
  },
  "login": {
    "title": "تسجيل دخول الإدارة",
    "identifier": "البريد الإلكتروني أو الهاتف",
    "password": "كلمة المرور",
    "submit": "تسجيل الدخول",
    "error": "بيانات الدخول غير صحيحة"
  },
  "products": {
    "title": "المنتجات",
    "new": "منتج جديد",
    "empty": "لا توجد منتجات بعد",
    "table": {
      "name": "الاسم",
      "sku": "رمز المنتج",
      "type": "النوع",
      "price": "السعر",
      "status": "الحالة",
      "actions": "إجراءات"
    },
    "form": {
      "internalName": "الاسم الداخلي",
      "nameAr": "الاسم (عربي)",
      "nameEn": "الاسم (إنجليزي)",
      "oneLinerAr": "وصف مختصر (عربي)",
      "oneLinerEn": "وصف مختصر (إنجليزي)",
      "type": "النوع",
      "sku": "رمز المنتج",
      "basePrice": "السعر الأساسي",
      "salePrice": "سعر التخفيض",
      "currency": "العملة",
      "vatRule": "قاعدة الضريبة",
      "deliveryMethod": "طريقة التسليم",
      "couponEligible": "قابل للخصم بكوبون",
      "featured": "مميز",
      "save": "حفظ",
      "saveSuccess": "تم حفظ المنتج",
      "saveError": "تعذر حفظ المنتج",
      "deleteConfirmTitle": "حذف هذا المنتج؟",
      "deleteConfirmBody": "لا يمكن التراجع عن هذا الإجراء.",
      "deleteConfirm": "حذف",
      "deleteCancel": "إلغاء",
      "deleteSuccess": "تم حذف المنتج",
      "deleteError": "تعذر حذف المنتج"
    },
    "validation": {
      "nameRequired": "الاسم مطلوب",
      "nameTooLong": "الاسم طويل جدًا",
      "typeInvalid": "اختر نوع منتج صالح",
      "skuInvalid": "رمز المنتج يجب أن يحتوي على حروف وأرقام و - و _ فقط",
      "priceInvalid": "أدخل سعرًا صالحًا",
      "currencyInvalid": "العملة يجب أن تكون 3 أحرف"
    }
  }
}
```

- [ ] **Step 3: Register the namespace**

Modify `i18n/request.ts` — add `admin` to the `messages` object:

```ts
    products: (await import(`../messages/${locale}/products.json`)).default,
    admin: (await import(`../messages/${locale}/admin.json`)).default,
```

(inserted after the existing `products` line, alongside the other namespace imports)

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors. Run `npm run dev` and confirm no console warning about missing `admin` namespace when visiting any existing page.

- [ ] **Step 5: Commit**

```bash
git add messages/ar/admin.json messages/en/admin.json i18n/request.ts
git commit -m "feat(admin): add admin i18n namespace (ar/en)"
```

---

## Task 7: Product-specific validation schema factory

**Files:**
- Create: `types/dto/product-form.dto.ts`

**Interfaces:**
- Consumes: `CreateProductSchema`, `UpdateProductSchema` (Task 4).
- Produces: `makeCreateProductSchema(t: ReturnType<typeof useTranslations>)`, `makeUpdateProductSchema(t: ...)` — consumed by `ProductFormClient.tsx` (Task 11).

- [ ] **Step 1: Write the schema factory**

Create `types/dto/product-form.dto.ts`:

```ts
import { z } from 'zod'
import type { useTranslations } from 'next-intl'
import { ProductTypeValues } from '@/types/dto/product.dto'

type T = ReturnType<typeof useTranslations<'admin'>>

export function makeCreateProductSchema(t: T) {
  return z.object({
    brand_id: z.number().int().min(1).nullable().optional(),
    internal_name: z.string().min(1, t('products.validation.nameRequired')).max(200, t('products.validation.nameTooLong')),
    type: z.number().refine((v) => (ProductTypeValues as readonly number[]).includes(v), t('products.validation.typeInvalid')),
    delivery_method: z.number().int(),
    base_price: z.number().min(0, t('products.validation.priceInvalid')).max(999999.99),
    sale_price: z.number().min(0).optional(),
    currency: z.string().length(3, t('products.validation.currencyInvalid')),
    vat_rule: z.number().int(),
    sku: z.string().max(80).regex(/^[A-Za-z0-9\-_]+$/, t('products.validation.skuInvalid')),
    coupon_eligible: z.boolean(),
    featured: z.boolean(),
    translations: z.object({
      ar: z.object({
        name: z.string().min(1, t('products.validation.nameRequired')).max(200, t('products.validation.nameTooLong')),
        one_liner: z.string().max(300).nullable().optional(),
      }),
      en: z.object({
        name: z.string().max(200).optional(),
        one_liner: z.string().max(300).nullable().optional(),
      }).optional(),
    }),
  })
}

export function makeUpdateProductSchema(t: T) {
  return makeCreateProductSchema(t).omit({ brand_id: true }).extend({
    status: z.number().int().optional(),
  })
}

export type ProductFormValues = z.infer<ReturnType<typeof makeCreateProductSchema>>
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/dto/product-form.dto.ts
git commit -m "feat(admin): add localized product form validation schema factory"
```

---

## Task 8: Admin login page

**Files:**
- Create: `app/[locale]/(admin)/login/page.tsx`
- Create: `components/admin/LoginFormClient.tsx`

**Interfaces:**
- Consumes: `POST /api/admin/auth/login` (Task 3), `AdminLoginRequestSchema` (Task 3).
- Produces: `/{locale}/admin/login` route — entry point for `AdminGuard` (Task 9) redirects.

- [ ] **Step 1: Login form (Client Component)**

Create `components/admin/LoginFormClient.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminLoginRequestSchema, type AdminLoginRequest } from '@/types/dto/auth.dto'

export function LoginFormClient() {
  const t = useTranslations('admin')
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<AdminLoginRequest>({
    resolver: zodResolver(AdminLoginRequestSchema),
    defaultValues: { identifier: '', password: '' },
  })

  async function onSubmit(values: AdminLoginRequest) {
    setIsPending(true)
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        sileo.error({ title: t('login.error') })
        return
      }
      router.push('./products')
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="identifier" className="text-sm font-medium">{t('login.identifier')}</label>
        <Input id="identifier" {...form.register('identifier')} />
        {form.formState.errors.identifier && (
          <p className="text-sm text-destructive">{form.formState.errors.identifier.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">{t('login.password')}</label>
        <Input id="password" type="password" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : t('login.submit')}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Login page (Server Component)**

Create `app/[locale]/(admin)/login/page.tsx`:

```tsx
import { getTranslations } from 'next-intl/server'
import { LoginFormClient } from '@/components/admin/LoginFormClient'

export default async function AdminLoginPage() {
  const t = await getTranslations('admin')

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-xl font-semibold">{t('login.title')}</h1>
        <LoginFormClient />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/(admin)/login" components/admin/LoginFormClient.tsx
git commit -m "feat(admin): add admin login page"
```

---

## Task 9: Admin route group — layout, guard, shell

**Files:**
- Create: `app/[locale]/(admin)/layout.tsx`
- Create: `components/admin/AdminShellClient.tsx`
- Create: `lib/admin/query-provider.tsx`

**Interfaces:**
- Consumes: `getAdminTokenCookie()` (Task 3), `getQueryClient()` (Task 5), shadcn `Sidebar*` (Task 2).
- Produces: `(admin)/layout.tsx` — every admin page (Tasks 10-11) renders inside this; redirects to `./login` when unauthenticated.

- [ ] **Step 1: React Query provider (Client Component wrapper)**

Create `lib/admin/query-provider.tsx`:

```tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/admin/query-client'

export function AdminQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

- [ ] **Step 2: Admin shell (sidebar nav, Client Component)**

Create `components/admin/AdminShellClient.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'

export function AdminShellClient({ children, locale }: { children: React.ReactNode; locale: string }) {
  const t = useTranslations('admin')
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push(`/${locale}/admin/login`)
    router.refresh()
  }

  return (
    <SidebarProvider>
      <Sidebar side={locale === 'ar' ? 'right' : 'left'}>
        <SidebarHeader className="px-4 py-3 font-semibold">{t('nav.dashboard')}</SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin`)}>
                <LayoutDashboard data-icon="inline-start" />
                {t('nav.dashboard')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin/products`)}>
                <Package data-icon="inline-start" />
                {t('nav.products')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut data-icon="inline-start" />
                {t('nav.logout')}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
        </div>
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Step 3: Admin layout (Server Component — auth guard)**

Create `app/[locale]/(admin)/layout.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { getAdminTokenCookie } from '@/lib/admin/auth'
import { AdminQueryProvider } from '@/lib/admin/query-provider'
import { AdminShellClient } from '@/components/admin/AdminShellClient'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const token = await getAdminTokenCookie()

  // NOTE: as placed here, redirecting to /admin/login would loop forever,
  // since /admin/login itself is currently nested under this same guarded
  // layout. Step 4 below moves the login page to a separate route group
  // so it renders without this guard — do not skip Step 4.
  if (!token) {
    redirect(`/${locale}/admin/login`)
  }

  return (
    <AdminQueryProvider>
      <AdminShellClient locale={locale}>{children}</AdminShellClient>
    </AdminQueryProvider>
  )
}
```

- [ ] **Step 4: Fix the login-redirect-loop**

The guard in Step 3 would redirect `/admin/login` to itself when unauthenticated. Move the login route out from under the guarded layout: create `app/[locale]/(admin-auth)/login/page.tsx` as a new route group sibling to `(admin)`, and delete the `app/[locale]/(admin)/login/` folder from Task 8.

```bash
mkdir -p "app/[locale]/(admin-auth)/login"
git mv "app/[locale]/(admin)/login/page.tsx" "app/[locale]/(admin-auth)/login/page.tsx"
rmdir "app/[locale]/(admin)/login"
```

`(admin-auth)` has no `layout.tsx` of its own, so it falls through to the root `[locale]/layout.tsx` only (slim, no guard) — `/admin/login` renders standalone.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run dev`, visit `/ar/admin` (no cookie set) → expect redirect to `/ar/admin/login` with no infinite loop.

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/(admin)" "app/[locale]/(admin-auth)" components/admin/AdminShellClient.tsx lib/admin/query-provider.tsx
git commit -m "feat(admin): add admin layout with auth guard and sidebar shell"
```

---

## Task 10: Products list page

**Files:**
- Create: `app/[locale]/(admin)/products/page.tsx`
- Create: `app/[locale]/(admin)/products/loading.tsx`
- Create: `components/admin/products/ProductsTableClient.tsx`
- Create: `components/admin/products/DeleteProductDialogClient.tsx`

**Interfaces:**
- Consumes: `adminFetchServer` (Task 4), `useProductsQuery`/`useDeleteProduct` (Task 5), `Product` (Task 4).
- Produces: `/{locale}/admin/products` route.

- [ ] **Step 1: Skeleton loading state**

Create `app/[locale]/(admin)/products/loading.tsx`:

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Delete confirmation dialog**

Create `components/admin/products/DeleteProductDialogClient.tsx`:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteProduct } from '@/hooks/queries/useProducts'

export function DeleteProductDialogClient({
  ulid, open, onOpenChange,
}: {
  ulid: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('admin.products.form')
  const deleteProduct = useDeleteProduct()

  async function handleConfirm() {
    const result = await deleteProduct.mutateAsync(ulid)
    if (!result.ok) {
      sileo.error({ title: t('deleteError') })
      return
    }
    sileo.success({ title: t('deleteSuccess') })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
          <DialogDescription>{t('deleteConfirmBody')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('deleteCancel')}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteProduct.isPending}>
            {deleteProduct.isPending ? '...' : t('deleteConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Products table (Client Component, react-query)**

Create `components/admin/products/ProductsTableClient.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useProductsQuery } from '@/hooks/queries/useProducts'
import { DeleteProductDialogClient } from './DeleteProductDialogClient'
import type { Product } from '@/types/dto/product.dto'

export function ProductsTableClient({ locale }: { locale: string }) {
  const t = useTranslations('admin.products')
  const router = useRouter()
  const { data, isLoading } = useProductsQuery()
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  if (isLoading) return null // route-level loading.tsx already covers the initial paint

  const items = data?.items ?? []

  if (items.length === 0) {
    return <p className="text-muted-foreground">{t('empty')}</p>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>{t('table.sku')}</TableHead>
            <TableHead>{t('table.type')}</TableHead>
            <TableHead>{t('table.price')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead className="text-end">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product, i) => (
            <motion.tr
              key={product.ulid}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
              className="border-b"
            >
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.type.label}</TableCell>
              <TableCell>{product.base_price} {product.currency}</TableCell>
              <TableCell>{product.status?.label ?? '—'}</TableCell>
              <TableCell className="text-end">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/${locale}/admin/products/${product.ulid}`)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setPendingDelete(product)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      {pendingDelete && (
        <DeleteProductDialogClient
          ulid={pendingDelete.ulid}
          open={!!pendingDelete}
          onOpenChange={(open) => !open && setPendingDelete(null)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 4: Products page (Server Component, hydrates react-query)**

Create `app/[locale]/(admin)/products/page.tsx`:

```tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getQueryClient } from '@/lib/admin/query-client'
import { adminFetchServer } from '@/lib/admin/api-server'
import { productsQueryKey } from '@/hooks/queries/useProducts'
import { ProductsTableClient } from '@/components/admin/products/ProductsTableClient'
import type { Product } from '@/types/dto/product.dto'

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('admin.products')
  const queryClient = getQueryClient()

  const result = await adminFetchServer<Product[]>('/admin/products')

  await queryClient.prefetchQuery({
    queryKey: productsQueryKey(),
    queryFn: async () => ({
      items: result.ok ? result.data : [],
      meta: result.ok ? result.meta : undefined,
    }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/products/new`}>{t('new')}</Link>
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsTableClient locale={locale} />
      </HydrationBoundary>
    </div>
  )
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/(admin)/products/page.tsx" "app/[locale]/(admin)/products/loading.tsx" components/admin/products/ProductsTableClient.tsx components/admin/products/DeleteProductDialogClient.tsx
git commit -m "feat(admin): add products list page with skeleton loading and delete dialog"
```

---

## Task 11: Product create/edit page

**Files:**
- Create: `app/[locale]/(admin)/products/[ulid]/page.tsx`
- Create: `app/[locale]/(admin)/products/[ulid]/loading.tsx`
- Create: `components/admin/products/ProductFormClient.tsx`

**Interfaces:**
- Consumes: `adminFetchServer` (Task 4), `useProductQuery`/`useCreateProduct`/`useUpdateProduct` (Task 5), `makeCreateProductSchema`/`makeUpdateProductSchema` (Task 7), `Product` (Task 4).
- Produces: `/{locale}/admin/products/new` and `/{locale}/admin/products/{ulid}` routes.

- [ ] **Step 1: Skeleton loading state**

Create `app/[locale]/(admin)/products/[ulid]/loading.tsx`:

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductFormLoading() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <Skeleton className="h-8 w-64" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Product form (Client Component)**

Create `components/admin/products/ProductFormClient.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { makeCreateProductSchema, makeUpdateProductSchema, type ProductFormValues } from '@/types/dto/product-form.dto'
import { ProductTypeValues, ProductTypeLabels } from '@/types/dto/product.dto'
import { useCreateProduct, useUpdateProduct } from '@/hooks/queries/useProducts'
import type { Product } from '@/types/dto/product.dto'

export function ProductFormClient({ locale, existing }: { locale: string; existing: Product | null }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const isNew = existing === null

  const schema = isNew ? makeCreateProductSchema(t) : makeUpdateProductSchema(t)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(existing?.ulid ?? '')

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: existing
      ? {
          internal_name: existing.internal_name,
          type: existing.type.id,
          delivery_method: existing.delivery_method.id,
          base_price: Number(existing.base_price),
          currency: existing.currency,
          vat_rule: existing.vat_rule.id,
          sku: existing.sku,
          coupon_eligible: existing.coupon_eligible,
          featured: existing.featured,
          translations: { ar: { name: existing.name, one_liner: existing.one_liner } },
        }
      : {
          internal_name: '',
          type: ProductTypeValues[0],
          delivery_method: 1,
          base_price: 0,
          currency: 'EGP',
          vat_rule: 1,
          sku: '',
          coupon_eligible: false,
          featured: false,
          translations: { ar: { name: '', one_liner: '' } },
        },
  })

  async function onSubmit(values: ProductFormValues) {
    const mutation = isNew ? createProduct : updateProduct
    const result = await mutation.mutateAsync(values as never)
    if (!result.ok) {
      sileo.error({ title: t('products.form.saveError'), description: result.message })
      return
    }
    sileo.success({ title: t('products.form.saveSuccess') })
    router.push(`/${locale}/admin/products`)
    router.refresh()
  }

  const isPending = createProduct.isPending || updateProduct.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.internalName')}</label>
        <Input {...form.register('internal_name')} />
        {form.formState.errors.internal_name && (
          <p className="text-sm text-destructive">{form.formState.errors.internal_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.nameAr')}</label>
        <Input {...form.register('translations.ar.name')} dir="rtl" />
        {form.formState.errors.translations?.ar?.name && (
          <p className="text-sm text-destructive">{form.formState.errors.translations.ar.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.oneLinerAr')}</label>
        <Input {...form.register('translations.ar.one_liner')} dir="rtl" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.nameEn')}</label>
        <Input {...form.register('translations.en.name')} dir="ltr" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.type')}</label>
        <Select
          value={String(form.watch('type'))}
          onValueChange={(v) => form.setValue('type', Number(v), { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ProductTypeValues.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {ProductTypeLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.sku')}</label>
        <Input {...form.register('sku')} />
        {form.formState.errors.sku && (
          <p className="text-sm text-destructive">{form.formState.errors.sku.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('products.form.basePrice')}</label>
          <Input type="number" step="0.01" {...form.register('base_price', { valueAsNumber: true })} />
          {form.formState.errors.base_price && (
            <p className="text-sm text-destructive">{form.formState.errors.base_price.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <label className="text-sm font-medium">{t('products.form.currency')}</label>
          <Input {...form.register('currency')} maxLength={3} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={form.watch('coupon_eligible')}
          onCheckedChange={(v) => form.setValue('coupon_eligible', v)}
        />
        <label className="text-sm font-medium">{t('products.form.couponEligible')}</label>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={form.watch('featured')} onCheckedChange={(v) => form.setValue('featured', v)} />
        <label className="text-sm font-medium">{t('products.form.featured')}</label>
      </div>

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? '...' : t('products.form.save')}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Product edit/create page (Server Component)**

Create `app/[locale]/(admin)/products/[ulid]/page.tsx`:

```tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { getQueryClient } from '@/lib/admin/query-client'
import { adminFetchServer } from '@/lib/admin/api-server'
import { productQueryKey } from '@/hooks/queries/useProducts'
import { ProductFormClient } from '@/components/admin/products/ProductFormClient'
import type { Product } from '@/types/dto/product.dto'

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ locale: string; ulid: string }>
}) {
  const { locale, ulid } = await params
  const t = await getTranslations('admin.products')
  const isNew = ulid === 'new'
  const queryClient = getQueryClient()

  let existing: Product | null = null

  if (!isNew) {
    const result = await adminFetchServer<Product>(`/admin/products/${ulid}`)
    if (result.ok) {
      existing = result.data
      await queryClient.prefetchQuery({ queryKey: productQueryKey(ulid), queryFn: async () => result.data })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{isNew ? t('new') : existing?.name}</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductFormClient locale={locale} existing={existing} />
      </HydrationBoundary>
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/(admin)/products/[ulid]" components/admin/products/ProductFormClient.tsx
git commit -m "feat(admin): add product create/edit form page"
```

---

## Task 12: Manual verification pass

**Files:** none — verification only.

- [ ] **Step 1: Confirm backend is reachable and migrated**

Run (in `backend/`): `php artisan migrate:status | head -5`
If migrations show as pending, tell the user — this plan's CRUD cannot be exercised end-to-end against an unmigrated database. Do not run `php artisan migrate` yourself unless explicitly asked.

- [ ] **Step 2: Start both dev servers**

Run (in `backend/`): whatever this project's local server command is (check `README.md` — likely `php artisan octane:start` or `php artisan serve`, since `CLAUDE.md` specifies FrankenPHP/Octane).
Run (in `meinc/`): `npm run dev`

- [ ] **Step 3: Manual walkthrough**

In a browser:
1. Visit `/ar/admin` with no cookie → confirm redirect to `/ar/admin/login`, no infinite loop.
2. Log in with a real admin account (create one via `php artisan tinker` if none exists — do not run migrations to do this, only seed/tinker if the schema is already migrated).
3. Confirm redirect to `/ar/admin/products`, sidebar renders on the right (RTL), skeleton flashes briefly then the table (or empty state) renders.
4. Click "New Product" (`/ar/admin/products/new`), fill the form, submit — confirm a success toast, redirect to the list, and the new row appears.
5. Click "Edit" on that row — confirm the form pre-fills with the saved values.
6. Change a field, save — confirm the updated value reflects in the list.
7. Click "Delete", confirm in the dialog — confirm the row disappears and a success toast shows.
8. Switch to `/en/admin/products` — confirm layout mirrors to LTR, sidebar moves to the left, English labels render.

- [ ] **Step 4: Report findings**

If any step fails, note the exact error (browser console + network tab response body) rather than guessing — this is real-backend integration, and failures here are either a genuine bug in this plan's code or a backend contract mismatch worth flagging back to the backend work.

No commit for this task — it's verification only.

---

## Scope note

This plan covers admin product CRUD for core fields only (name, one-liner, type, SKU, base price, currency, VAT rule, delivery method, coupon eligibility, featured flag) plus the admin auth/shell scaffolding all future admin pages will reuse. Explicitly deferred: the ~9 product sub-resource tabs (assets, SEO, delivery config, funnel config, visibility, bundle items, testimonials, FAQs, CRM tags), admin orders/coupons pages, and the storefront checkout/pay wiring — each becomes its own plan once this pattern is proven working end-to-end.
