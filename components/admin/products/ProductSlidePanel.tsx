'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ProductFormClient } from './ProductFormClient'
import { ProductDescriptionForm } from './ProductDescriptionForm'
import { ProductSeoForm } from './ProductSeoForm'
import { ProductDeliveryForm } from './ProductDeliveryForm'
import { ProductAssetsSection } from './ProductAssetsSection'
import { ProductTestimonialsSection } from './ProductTestimonialsSection'
import { ProductFaqsSection } from './ProductFaqsSection'
import { FunnelConfigFormClient } from './FunnelConfigFormClient'
import { useProductQuery } from '@/hooks/queries/useProducts'
import { useFunnelConfigQuery } from '@/hooks/queries/useFunnelConfig'

interface ProductSlidePanelProps {
  ulid: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
}

const TABS_NEW = [{ id: 'basic', label: 'Basic' }]
const TABS_EDIT = [
  { id: 'basic', label: 'Basic' },
  { id: 'description', label: 'Description' },
  { id: 'seo', label: 'SEO' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'assets', label: 'Assets' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'funnel', label: 'Funnel' },
]

function PanelContent({ ulid, locale, onClose }: { ulid: string; locale: string; onClose: () => void }) {
  const isNew = ulid === 'new'
  const { data: product } = useProductQuery(ulid)
  const { data: funnelConfig } = useFunnelConfigQuery(ulid)
  const t = useTranslations('admin')
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('basic')

  const tabs = isNew ? TABS_NEW : TABS_EDIT

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    onClose()
  }

  return (
    <>
      <SheetHeader className="border-b pb-4">
        <SheetTitle>{isNew ? t('products.new') : (product?.name ?? '…')}</SheetTitle>
      </SheetHeader>

      {!isNew && (
        <div className="flex gap-1 overflow-x-auto border-b py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="py-6">
        {activeTab === 'basic' && (
          <ProductFormClient
            locale={locale}
            existing={product ?? null}
            onSuccess={isNew ? handleSuccess : undefined}
          />
        )}
        {!isNew && activeTab === 'description' && <ProductDescriptionForm ulid={ulid} />}
        {!isNew && activeTab === 'seo' && <ProductSeoForm ulid={ulid} />}
        {!isNew && activeTab === 'delivery' && <ProductDeliveryForm ulid={ulid} />}
        {!isNew && activeTab === 'assets' && <ProductAssetsSection ulid={ulid} />}
        {!isNew && activeTab === 'testimonials' && <ProductTestimonialsSection ulid={ulid} />}
        {!isNew && activeTab === 'faqs' && <ProductFaqsSection ulid={ulid} />}
        {!isNew && activeTab === 'funnel' && (
          <FunnelConfigFormClient productUlid={ulid} existing={funnelConfig ?? null} />
        )}
      </div>
    </>
  )
}

export function ProductSlidePanel({ ulid, open, onOpenChange, locale }: ProductSlidePanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl overflow-y-auto p-6 sm:max-w-5xl"
      >
        {ulid && open && (
          <PanelContent ulid={ulid} locale={locale} onClose={() => onOpenChange(false)} />
        )}
      </SheetContent>
    </Sheet>
  )
}
