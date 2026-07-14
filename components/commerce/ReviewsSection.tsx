'use client'

import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SampleReview {
  name: string
  daysAgo: number
  comment: string
}

/** Approximate 5-star distribution from a single average rating, for the summary bars. */
function distributionFromRating(rating: number): number[] {
  const top = Math.max(0, Math.min(1, (rating - 3) / 2))
  return [top, (1 - top) * 0.55, (1 - top) * 0.25, (1 - top) * 0.12, (1 - top) * 0.08]
}

export function ReviewsSection({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const t = useTranslations('products.reviews')
  const distribution = distributionFromRating(rating)
  const sample = t.raw('sample') as SampleReview[]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="heading-3">{t('title')}</h2>
          <p className="caption mt-1">{t('basedOn', { count: reviewCount })}</p>
        </div>
        <Button variant="outline">{t('writeReview')}</Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">{rating}</span>
            <div className="flex items-center gap-0.5 text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4" fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {distribution.map((pct, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3">{5 - i}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-amber" style={{ width: `${Math.round(pct * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ul className="m-0 flex list-none flex-col gap-6 p-0">
          {sample.map((review) => (
            <li key={review.name} className="border-b border-border pb-6 last:border-0">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{review.name}</span>
                <span className="caption">{review.daysAgo}d</span>
              </div>
              <div className="mb-2 flex items-center gap-0.5 text-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5" fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="body text-sm">{review.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
