import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { FunnelStepClient } from '@/components/commerce/FunnelStepClient'
import { customerFetchServer } from '@/lib/customer/api-server'
import type { FunnelNextStep } from '@/types/dto/funnel-flow.dto'

const COMPLETE_STEP: FunnelNextStep = {
  step: 'complete',
  order_ulid: 'demo',
  product: null,
  price: null,
  original_price: null,
  timer_minutes: null,
  headline: null,
}

const DEMO_OTO_STEP: FunnelNextStep = {
  step: 'oto',
  order_ulid: 'demo',
  product: {
    ulid: 'demo-product',
    name: 'Premium Growth Bundle',
    hero_image_url: null,
  },
  price: '29',
  original_price: '97',
  timer_minutes: 15,
  headline: 'Wait! Grab our Premium Bundle at 70% off — today only',
}

export default async function FunnelStepPage({
  params,
}: {
  params: Promise<{ locale: string; orderUlid: string }>
}) {
  const { orderUlid } = await params
  const result = await customerFetchServer<FunnelNextStep>(`/funnel/${orderUlid}/next-step`)

  const initialStep = orderUlid === 'demo' ? DEMO_OTO_STEP : result.ok ? result.data : COMPLETE_STEP

  return (
    <Section as="div" className="section-y">
      <Container>
        <FunnelStepClient orderUlid={orderUlid} initialStep={initialStep} />
      </Container>
    </Section>
  )
}
