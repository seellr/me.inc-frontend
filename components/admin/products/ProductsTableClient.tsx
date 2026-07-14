'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useProductsQuery } from '@/hooks/queries/useProducts'
import { DeleteProductDialogClient } from './DeleteProductDialogClient'
import { ProductSlidePanel } from './ProductSlidePanel'
import type { Product } from '@/types/dto/product.dto'

export function ProductsTableClient({ locale }: { locale: string }) {
  const t = useTranslations('admin.products')
  const { data, isLoading } = useProductsQuery()
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [editUlid, setEditUlid] = useState<string | null>(null)

  if (isLoading) return null

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
                  <Button size="sm" variant="outline" onClick={() => setEditUlid(product.ulid)}>
                    {t('table.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setPendingDelete(product)}>
                    {t('table.delete')}
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      <ProductSlidePanel
        ulid={editUlid}
        open={!!editUlid}
        onOpenChange={(open) => !open && setEditUlid(null)}
        locale={locale}
      />

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
