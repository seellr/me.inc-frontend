import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { LoginFormClient } from '@/components/customer/LoginFormClient'

export default async function CustomerLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('auth')

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <div className="flex flex-col items-center gap-6">
          <h1 className="heading-2">{t('login.title')}</h1>
          <LoginFormClient locale={locale} />
        </div>
      </Container>
    </Section>
  )
}
