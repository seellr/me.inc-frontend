import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'

export default async function NotFoundPage() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'common.notFound' })

  return (
    <Section as="div" className="flex min-h-[60vh] items-center">
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="font-display text-[clamp(80px,18vw,180px)] font-bold leading-none text-foreground/10 select-none">
          404
        </p>
        <div className="-mt-4 flex flex-col gap-2">
          <h1 className="heading-2">{t('title')}</h1>
          <p className="body max-w-md text-muted-foreground">{t('body')}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: 'lg' })}>{t('home')}</Link>
          <Link href="/products" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>{t('shop')}</Link>
        </div>
      </Container>
    </Section>
  )
}
