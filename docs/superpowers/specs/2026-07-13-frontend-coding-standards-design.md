# Frontend Coding Standards (meinc)

Date: 2026-07-13

## Context

meinc is about to grow fast (admin dashboard port, then MVP deploy served from backend). Before more code lands, we need one standard structure/pattern set so storefront and admin code stay consistent, testable, and clean as the app scales. This spec is the standard; it supersedes the data-fetching pattern originally assumed in `2026-07-13-admin-dashboard-port-design.md` (that spec assumed client-fetched `useEffect`+fetch — this spec's server-fetch + react-query hydration approach replaces it).

## Standards

### 1. Server/Client boundary

`page.tsx` is always a Server Component — never `'use client'`. It fetches initial data directly (via `lib/api/{domain}.ts` functions) and passes it down. All interactivity (tables with sort/filter, forms, modals, anything stateful) lives in a Client Component, named with a `Client` suffix (e.g. `ProductTableClient.tsx`) so the `'use client'` boundary is visible from the filename alone. `layout.tsx` is server by default; if a layout must be client, that's an exception and should be justified with a short comment.

### 2. DTOs

One file per backend module under `types/dto/`: `product.dto.ts`, `order.dto.ts`, `coupon.dto.ts`, `auth.dto.ts`, etc — names mirror backend module boundaries (`auth`, `product`, `checkout`, `payment`, `funnel`, `shipping`, `crm`, ...). Each file exports a zod schema (request/response shape) plus its inferred TS type via `z.infer`. No inline/ad-hoc types for API data anywhere else — components, hooks, and forms all import from here. The zod schema is also the runtime validator used by forms (see section 6).

### 3. Data/state layer

- `lib/api/{domain}.ts` — thin fetch functions per domain, DTO-typed input/output, no UI logic.
- `hooks/queries/use{Domain}.ts` — react-query `useQuery`/`useMutation` wrappers around the api functions. This is the only place react-query lives.
- `page.tsx` server-fetches initial data using the same `lib/api/{domain}.ts` functions, then hydrates it into react-query via `dehydrate`/`HydrationBoundary` so Client Components get instant data and can refetch/mutate without a client-side waterfall on first load.
- Mutations (create/update/delete) go through react-query `useMutation` calling `lib/api/{domain}.ts`, followed by `invalidateQueries` — not Server Actions. One data layer, not two.
- Redux (`store/`) is reserved for cross-cutting client UI state only — sidebar open/collapsed, active table filters, impersonation banner visibility. It never holds server/domain data; that's react-query's job.

### 4. Component organization & naming

Centralized by domain under `components/{domain}/` (e.g. `components/admin/products/ProductTable.tsx`, `ProductFormClient.tsx`) — not colocated per-route. PascalCase for component files, camelCase for everything else (`useProducts.ts`, `product.dto.ts`, `api.ts`). Any file starting with `'use client'` carries a `Client` suffix in its filename.

### 5. Loading / error / feedback states

- Route-level loading: `loading.tsx` per route, rendering a skeleton matching that section's layout — not a spinner.
- Button-level loading: inline loading indicator on the button itself while a mutation is pending (`useMutation().isPending`).
- Field-level errors: inlined under each input, sourced from `react-hook-form`'s `formState.errors`, messages localized (section 6).
- Success/failure notifications: sileo's existing `Toaster` (already used in meinc) — not inline banners.
- Route-level fatal errors (network down, 5xx): `error.tsx` error boundary, separate from field/toast-level errors.

### 6. Validation & localization

Zod schemas from `types/dto/` are reused as `react-hook-form` resolvers. Validation messages are not hardcoded — they're resolved through next-intl (`useTranslations('admin.validation')` or equivalent per-area namespace) via schema factory functions (e.g. `makeCouponSchema(t)`), so every form is correct in both `ar` and `en` by construction, not as an afterthought.

### 7. RTL/LTR

No directional Tailwind classes (`pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`, `text-left`, `text-right`) anywhere in new or touched code — use logical equivalents (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`, `text-end`) instead, so layout flips automatically with `dir`. Directional icons (chevrons, arrows) get `rtl:rotate-180` explicitly, since logical properties don't flip glyphs. `dir` is set once per locale root layout (already the case in `[locale]/layout.tsx`); nothing below it should set `dir` again.

## Scope

This spec governs all new frontend code in meinc from this point forward (admin port, storefront changes, future MVP work). It does not require retroactively rewriting already-shipped storefront code in one pass — apply it going forward and opportunistically when touching existing files.
