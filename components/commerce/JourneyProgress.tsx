'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['cart', 'shipping', 'payment', 'confirmation'] as const
export type JourneyStep = (typeof STEPS)[number]

/** Shared progress indicator reused across Cart and Checkout, giving a sense of one guided path. */
export function JourneyProgress({ current }: { current: JourneyStep }) {
  const t = useTranslations('cart')
  const currentIndex = STEPS.indexOf(current)

  return (
    <ol className="mb-10 flex items-center gap-2 sm:gap-3">
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex

        return (
          <li key={step} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                done && 'bg-primary text-primary-foreground',
                active && 'bg-foreground text-background',
                !done && !active && 'bg-muted text-muted-foreground'
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn('hidden text-sm sm:inline', active ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
              {t(`steps.${step}`)}
            </span>
            {i < STEPS.length - 1 && (
              <span className={cn('h-0.5 flex-1', done ? 'bg-primary' : 'bg-border')} aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
