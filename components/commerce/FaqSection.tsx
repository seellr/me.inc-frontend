'use client'

import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

export function FaqSection() {
  const t = useTranslations('products.faq')
  const items = t.raw('items') as FaqItem[]

  return (
    <div>
      <h2 className="heading-3 mb-6">{t('title')}</h2>
      <div className="flex flex-col">
        {items.map((item) => (
          <details key={item.question} className="group border-b border-border py-4 first:pt-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground">
              {item.question}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="body mt-3 text-sm">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
