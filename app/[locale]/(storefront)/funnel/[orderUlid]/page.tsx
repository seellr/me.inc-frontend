import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { FunnelStepClient } from '@/components/commerce/FunnelStepClient'
import { customerFetchServer } from '@/lib/customer/api-server'
import { FunnelNextStepSchema } from '@/types/dto/storefront.dto'
import { mapFunnelStep } from '@/lib/orders/mappers'

export default async function FunnelStepPage({
  params,
}: {
  params: Promise<{ locale: string; orderUlid: string }>
}) {
  const { locale, orderUlid } = await params
  const result = await customerFetchServer<unknown>(
    `/funnel/${encodeURIComponent(orderUlid)}/next-step`,
    { schema: FunnelNextStepSchema },
  )

  if (!result.ok && result.status === 401) {
    redirect(`/${locale}/login?next=${encodeURIComponent(`/funnel/${orderUlid}`)}`)
  }

  const initialStep = result.ok ? mapFunnelStep(result.data as never) : null

  return (
    <Section as="div" className="section-y">
      <Container>
        <FunnelStepClient orderUlid={orderUlid} initialStep={initialStep} />
      </Container>
    </Section>
  )
}
