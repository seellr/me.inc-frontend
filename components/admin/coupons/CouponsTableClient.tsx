'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useCouponsQuery } from '@/hooks/queries/useCoupons'
import { DeleteCouponDialogClient } from './DeleteCouponDialogClient'
import type { Coupon } from '@/types/dto/coupon.dto'

export function CouponsTableClient({ locale }: { locale: string }) {
  const t = useTranslations('admin.coupons')
  const router = useRouter()
  const { data, isLoading } = useCouponsQuery()
  const [pendingDelete, setPendingDelete] = useState<Coupon | null>(null)

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
            <TableHead>{t('table.code')}</TableHead>
            <TableHead>{t('table.type')}</TableHead>
            <TableHead>{t('table.value')}</TableHead>
            <TableHead>{t('table.uses')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead className="text-end">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((coupon, i) => (
            <motion.tr
              key={coupon.ulid}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
              className="border-b"
            >
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.type.label}</TableCell>
              <TableCell>{coupon.value}</TableCell>
              <TableCell>{coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}</TableCell>
              <TableCell>{coupon.active ? '✓' : '—'}</TableCell>
              <TableCell className="text-end">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/${locale}/admin/coupons/${coupon.ulid}`)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setPendingDelete(coupon)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      {pendingDelete && (
        <DeleteCouponDialogClient
          ulid={pendingDelete.ulid}
          open={!!pendingDelete}
          onOpenChange={(open) => !open && setPendingDelete(null)}
        />
      )}
    </>
  )
}
