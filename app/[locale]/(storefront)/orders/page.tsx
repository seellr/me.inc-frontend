import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { OrdersListClient } from '@/components/commerce/OrdersListClient'
import { OrdersPageHeader } from '@/components/commerce/OrdersPageHeader'

export default function CustomerOrdersPage() {
  return (
    <Section as="div" className="section-y">
      <Container className="mx-auto max-w-2xl">
        <OrdersPageHeader />
        <OrdersListClient />
      </Container>
    </Section>
  )
}
