'use client'

import { useLocale, useTranslations } from 'next-intl'
import { CheckCircle2, Circle, Package, Truck, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/currency'
import type { Order, OrderStage } from '@/types/commerce'

const STAGE_ICONS: Record<OrderStage, typeof Package> = {
  placed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: Home,
}

const STAGE_ORDER: OrderStage[] = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

export function OrderStatusTimeline({ order }: { order: Order }) {
  const locale = useLocale()
  const t = useTranslations('orderLookup')
  const currentIndex = STAGE_ORDER.indexOf(order.currentStage)

  return (
    <ol className="relative flex flex-col gap-8 sm:flex-row sm:gap-0">
      {STAGE_ORDER.map((stage, i) => {
        const entry = order.timeline.find((e) => e.stage === stage)
        const done = i <= currentIndex
        const Icon = done ? STAGE_ICONS[stage] : Circle

        return (
          <li key={stage} className="relative flex flex-1 flex-col items-start gap-2 sm:items-center sm:text-center">
            {i < STAGE_ORDER.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  'absolute start-4 top-9 h-[calc(100%-2rem)] w-0.5 sm:start-1/2 sm:top-4 sm:h-0.5 sm:w-full',
                  done && i < currentIndex ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
            <span
              className={cn(
                'z-10 flex size-8 shrink-0 items-center justify-center rounded-full',
                done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="flex flex-col gap-0.5 ps-2 sm:ps-0">
              <span className={cn('text-sm font-medium', done ? 'text-foreground' : 'text-muted-foreground')}>
                {t(`stage.${stage}`)}
              </span>
              <span className="caption">
                {entry?.timestamp ? formatDateTime(entry.timestamp, locale) : t('pending')}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
