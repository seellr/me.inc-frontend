'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PackageSearch, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { StaggerGrid } from '@/components/motion'
import type { StoreCategory, StoreProduct } from '@/types/commerce'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Sort = 'featured' | 'priceAsc' | 'priceDesc'

export function ProductsListing({
  products,
  categories,
}: {
  products: StoreProduct[]
  categories: StoreCategory[]
}) {
  const t = useTranslations('products')
  const sortItems = [
    { value: 'featured', label: t('sort.featured') },
    { value: 'priceAsc', label: t('sort.priceAsc') },
    { value: 'priceDesc', label: t('sort.priceDesc') },
  ] as const

  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [sort, setSort] = useState<Sort>('featured')
  const priceCeiling = Math.max(...products.map((p) => p.price), 100)
  const [maxPrice, setMaxPrice] = useState<number>(priceCeiling)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleCategory = (slug: string) =>
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice)
    if (activeCategories.length > 0)
      list = list.filter((p) => activeCategories.includes(p.categorySlug))
    switch (sort) {
      case 'priceAsc': return [...list].sort((a, b) => a.price - b.price)
      case 'priceDesc': return [...list].sort((a, b) => b.price - a.price)
      default: return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [products, activeCategories, maxPrice, sort])

  const FiltersPanel = () => (
    <div className="flex flex-col gap-0">
      {/* Category pills */}
      <div className="pb-4 border-b border-border">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('filters.category')}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategories([])}
            className={
              'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
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
                'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                (activeCategories.includes(c.slug)
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground')
              }
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('filters.priceRange')}</p>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <p className="caption mt-1">0 – {maxPrice}</p>
      </div>
    </div>
  )

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="caption">{t('resultsCount', { count: filtered.length })}</p>
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            {t('filters.title')}
            {(activeCategories.length > 0 || maxPrice < priceCeiling) && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCategories.length || '!'}
              </span>
            )}
          </button>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sortItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">{t('filters.title')}</p>
            <button type="button" onClick={() => setMobileFiltersOpen(false)}>
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <FiltersPanel />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <p className="mb-4 text-sm font-semibold text-foreground">{t('filters.title')}</p>
          <FiltersPanel />
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
              <PackageSearch className="size-10" />
              <p>{t('emptyState')}</p>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
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
