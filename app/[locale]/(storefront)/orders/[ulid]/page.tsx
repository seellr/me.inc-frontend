import { notFound, redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { OrderDetailClient } from '@/components/commerce/OrderDetailClient'
import { customerFetchServer } from '@/lib/customer/api-server'
import { CustomerOrderResponseSchema } from '@/types/dto/storefront.dto'
import { mapOrder } from '@/lib/orders/mappers'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; ulid: string }>
}) {
  const { locale, ulid } = await params
  const result = await customerFetchServer<unknown>(`/orders/${encodeURIComponent(ulid)}`, {
    schema: CustomerOrderResponseSchema,
  })

  if (!result.ok && result.status === 401) {
    redirect(`/${locale}/login?next=${encodeURIComponent(`/orders/${ulid}`)}`)
  }
  if (!result.ok && result.status === 404) {
    notFound()
  }

  const initialOrder = result.ok ? mapOrder(result.data as never) : null

  return (
    <Section as="div" className="section-y">
      <Container className="mx-auto max-w-2xl">
        <OrderDetailClient ulid={ulid} initialOrder={initialOrder} />
      </Container>
    </Section>
  )
}
