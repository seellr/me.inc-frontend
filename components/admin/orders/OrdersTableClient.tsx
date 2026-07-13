'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useOrdersQuery } from '@/hooks/queries/useOrders'

export function OrdersTableClient({ locale }: { locale: string }) {
  const t = useTranslations('admin.orders')
  const router = useRouter()
  const { data, isLoading } = useOrdersQuery()

  if (isLoading) return null

  const items = data?.items ?? []

  if (items.length === 0) {
    return <p className="text-muted-foreground">{t('empty')}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.invoice')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
          <TableHead>{t('table.total')}</TableHead>
          <TableHead>{t('table.payment')}</TableHead>
          <TableHead>{t('table.date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((order, i) => (
          <motion.tr
            key={order.ulid}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: i * 0.02 }}
            className="cursor-pointer border-b"
            onClick={() => router.push(`/${locale}/admin/orders/${order.ulid}`)}
          >
            <TableCell>{order.invoice_number ?? order.ulid}</TableCell>
            <TableCell>{order.status.label}</TableCell>
            <TableCell>{order.total} {order.currency}</TableCell>
            <TableCell>{order.payment_method.label}</TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString(locale)}</TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  )
}
