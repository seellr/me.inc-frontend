import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { OrderDetailClient } from '@/components/commerce/OrderDetailClient'
import { customerFetchServer } from '@/lib/customer/api-server'
import type { CustomerOrder } from '@/types/dto/customer-order.dto'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; ulid: string }>
}) {
  const { ulid } = await params
  const result = await customerFetchServer<CustomerOrder>(`/orders/${ulid}`)
  const initialOrder = result.ok ? result.data : null

  return (
    <Section as="div" className="section-y">
      <Container className="mx-auto max-w-2xl">
        <h1 className="heading-2 mb-8">Order Details</h1>
        <OrderDetailClient ulid={ulid} initialOrder={initialOrder} />
      </Container>
    </Section>
  )
}
