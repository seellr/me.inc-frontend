import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { FunnelStepClient } from '@/components/commerce/FunnelStepClient'
import { customerFetchServer } from '@/lib/customer/api-server'
import type { FunnelNextStep } from '@/types/dto/funnel-flow.dto'

export default async function FunnelStepPage({
  params,
}: {
  params: Promise<{ locale: string; orderUlid: string }>
}) {
  const { locale, orderUlid } = await params
  const result = await customerFetchServer<FunnelNextStep>(`/funnel/${orderUlid}/next-step`)

  if (!result.ok) {
    redirect(`/${locale}/orders/lookup`)
  }

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <FunnelStepClient orderUlid={orderUlid} initialStep={result.data} />
      </Container>
    </Section>
  )
}
