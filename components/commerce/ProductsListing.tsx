'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, PackageSearch } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { StaggerGrid } from '@/components/motion'
import type { StoreCategory, StoreProduct } from '@/types/commerce'

type Sort = 'featured' | 'priceAsc' | 'priceDesc' | 'rating'

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-4 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground">
        {title}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 flex flex-col gap-2.5">{children}</div>
    </details>
  )
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-border text-primary accent-primary"
      />
      {label}
    </label>
  )
}

export function ProductsListing({
  products,
  categories,
}: {
  products: StoreProduct[]
  categories: StoreCategory[]
}) {
  const t = useTranslations('products')
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [sort, setSort] = useState<Sort>('featured')
  const priceCeiling = Math.max(...products.map((p) => p.price), 100)
  const [maxPrice, setMaxPrice] = useState<number>(priceCeiling)

  const toggleCategory = (slug: string) => {
    setActiveCategories((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice)
    if (activeCategories.length > 0) list = list.filter((p) => activeCategories.includes(p.categorySlug))

    switch (sort) {
      case 'priceAsc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'priceDesc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      default:
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [products, activeCategories, maxPrice, sort])

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-6">
        <button
          type="button"
          onClick={() => setActiveCategories([])}
          className={
            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ' +
            (activeCategories.length === 0
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground hover:text-foreground')
          }
        >
          {t('filters.allCategories')}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => toggleCategory(c.slug)}
            className={
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ' +
              (activeCategories.includes(c.slug)
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground')
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-4 text-sm font-semibold text-foreground">{t('filters.title')}</p>

          <FilterGroup title={t('filters.category')}>
            {categories.map((c) => (
              <CheckboxRow
                key={c.slug}
                label={c.name}
                checked={activeCategories.includes(c.slug)}
                onChange={() => toggleCategory(c.slug)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title={t('filters.priceRange')}>
            <input
              type="range"
              min={0}
              max={priceCeiling}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="caption">0 – {maxPrice}</p>
          </FilterGroup>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <p className="caption">{t('resultsCount', { count: filtered.length })}</p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t('sortLabel')}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none focus-visible:border-ring"
              >
                <option value="featured">{t('sort.featured')}</option>
                <option value="priceAsc">{t('sort.priceAsc')}</option>
                <option value="priceDesc">{t('sort.priceDesc')}</option>
                <option value="rating">{t('sort.rating')}</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
              <PackageSearch className="size-10" />
              <p>{t('emptyState')}</p>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggerGrid>
          )}
        </div>
      </div>
    </div>
  )
}
