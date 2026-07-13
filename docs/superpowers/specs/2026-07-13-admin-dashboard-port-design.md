# Admin Dashboard Port: frontend_draft → meinc

Date: 2026-07-13

## Context

`frontend_draft/app/admin/*` has a working admin dashboard (products, orders, coupons, brands, admins, plans, ai-tools, delivery, quizzes, vat-config, login, analytics, automation-rules, crm/customers, email/suppressions, email/sequences) with a real (non-mocked) API client. It needs to move into `meinc`, the production Next.js app, which already has locale-prefixed routing (`/ar`, `/en`) and RTL/LTR handling at the root layout via `next-intl`.

Backend contract source of truth: `backend/docs/06_PRD_Backend.md` (route list), `backend/docs/07_PRD_Frontend.md` (route group / API client shape), `backend/docs/MEINC_SPEC.md` (guard/audit rules).

### Audit findings (frontend_draft, current state)

- `lib/api.ts`: hardcoded API key duplicated in `serverFetch`/`api()`, no locale header sent, no request cancellation/retry, 401 just triggers logout (no refresh).
- `lib/auth.ts`: tokens stored in `localStorage` (XSS-exposed), no client-side expiry check, guard separation is key-name based only.
- `components/admin/AdminShell.tsx` / `AdminGuard.tsx`: nav hrefs and redirects are missing the `/admin` prefix that the actual route tree uses — broken navigation.
- Zero `rtl`/`dir=`/`ltr` usage anywhere in `app/admin` or `components/admin`, despite an Arabic UI dictionary (`lib/i18n/ar.ts`) and shadcn `Sidebar` usage.
- `app/admin/coupons/page.tsx` zod schema has no custom messages — English validation errors leak into an Arabic form.
- `app/admin/products/page.tsx`, `orders/page.tsx`: `useEffect` + manual `fetch`, cursor pagination works, but no `AbortController` — no race guard beyond disabling buttons.
- `app/admin/dashboard/page.tsx`: placeholder, static heading only, no data.

## Approach

Port + patch (not a rewrite): move existing files into meinc, fixing the specific bugs above during the move rather than rebuilding the data layer from scratch.

## Design

### 1. Route structure

Move `frontend_draft/app/admin/*` into `meinc/app/[locale]/(admin)/*` as a route group (no URL segment). Resulting URLs: `/ar/admin/products`, `/en/admin/orders`, etc. New `(admin)/layout.tsx`:
- Skips storefront chrome (no `Navbar`/`Footer`/`CartProvider`).
- Wraps children in ported `AdminProvider`.
- Sets `dir` from the `[locale]` param, same pattern as the existing root `[locale]/layout.tsx` (`DIRECTION = { ar: 'rtl', en: 'ltr' }`).

### 2. Data layer (`lib/api.ts`, `lib/auth.ts`)

Port into `meinc/lib/admin/` (or merge into existing `meinc/lib/`), patched during the move:
- Single env-driven API key constant, no duplication.
- Send `Accept-Language`/locale header on every admin request so the backend returns translated error messages.
- Fix `AdminShell`/`AdminGuard` nav hrefs to include the `/admin` prefix (now nested under `[locale]/(admin)`, so links must be locale + admin aware — use meinc's existing typed navigation helpers from `i18n/navigation.ts` rather than raw strings).
- Add `AbortController` to list-page fetches to cancel in-flight requests on filter/pagination changes.
- Token storage: move `token_admin` from `localStorage` to a cookie, set with `SameSite=Strict` (httpOnly only if backend login endpoint can set it directly — confirm during implementation; otherwise client-set non-httpOnly cookie is the fallback, still closes the XSS-via-JS-read gap that localStorage doesn't). Guard checks read the cookie, not localStorage.

### 3. RTL/LTR

Logical-properties pass across all ported admin components: replace `pl-/pr-/ml-/mr-/left-/right-/text-left/text-right` with `ps-/pe-/ms-/me-/start-/end-/text-start/text-end`. Directional icons (chevrons, arrows) get `rtl:rotate-180` since logical properties don't flip glyphs. shadcn `Sidebar` inherits `dir` from the `(admin)/layout.tsx` root — no per-component dir prop needed beyond that. No new i18n library; reuses meinc's existing next-intl setup.

### 4. Validation

Zod schemas move from hardcoded/missing English messages to next-intl-resolved messages. Pattern: schema factory functions (e.g. `makeCouponSchema(t)`) called inside the component with `t = useTranslations('admin.validation')`. New message namespace: `meinc/messages/{ar,en}/admin.json` (mirrors existing per-namespace file convention: `nav.json`, `cart.json`, etc.).

### 5. Dashboard (real data, not placeholder)

Build v1 dashboard widgets: today/week/month order count, revenue total, pending COD confirmation count. Sourced from `GET /v1/admin/orders` (per `06_PRD_Backend.md`). Open question for the implementation plan: confirm whether this endpoint supports the needed aggregation/filtering, or whether a summary endpoint needs to be added on the backend — flag to backend team if not.

### Scope

In scope: all pages listed in Context, ported with the fixes above applied structurally (route prefix fix, cancellation, cookie auth, RTL logical properties, localized validation), plus dashboard v1 widgets.

Out of scope: httpOnly cookie implementation on the backend login endpoint if it doesn't already support `Set-Cookie` (implementation plan should confirm and adjust, but backend endpoint changes beyond dashboard aggregation are not assumed here). Full "full overview" dashboard (top products, customer growth, coupon usage) — deferred past v1.
