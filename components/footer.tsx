'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InstagramIcon, LinkedinIcon, XIcon } from '@/components/social-icons'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'X', href: 'https://x.com', icon: XIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinIcon },
]

interface FooterColumn {
  heading: string
  links: { label: string; href: string }[]
}

interface LegalLink {
  label: string
  href: string
}

export function Footer() {
  const t = useTranslations('footer')
  const columns = t.raw('columns') as FooterColumn[]
  const legal = t.raw('legal') as LegalLink[]
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      <div aria-hidden className="footer-aurora pointer-events-none absolute inset-0" />

      <Container className="section-y relative flex flex-col gap-16">
        {/* Bento CTA row: newsletter card + accent CTA card */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-background text-foreground">
            <p className="text-sm font-semibold">{t('newsletterLabel')}</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t('tagline')}</p>
            <div className="mt-4 flex max-w-sm items-center gap-2">
              <Input id="footer-email" type="email" placeholder={t('newsletterPlaceholder')} />
              <Button variant="secondary" size="icon" aria-label={t('newsletterLabel')} className="shrink-0">
                <ArrowRight className="rtl:rotate-180" />
              </Button>
            </div>
          </Card>

          <Card className="bg-primary text-primary-foreground flex flex-col justify-between gap-6">
            <p className="heading-4 text-primary-foreground">{t('ctaHeadline')}</p>
            <div className="flex items-center justify-between gap-4">
              <Button render={<Link href="/orders/lookup" />} nativeButton={false} variant="default" className="bg-secondary text-secondary-foreground" >
                {t('ctaButton')}
              </Button>
              <span className="text-sm font-semibold opacity-80">me.inc</span>
            </div>
          </Card>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3">
              <p className="text-micro font-medium tracking-wide text-background/50 uppercase">
                {column.heading}
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/80 no-underline transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom bar */}
      <Container className="relative flex flex-col items-center gap-3 border-t border-background/15 py-4 text-xs text-background/60 sm:flex-row sm:justify-between">
        <span>{t('copyright', { year })}</span>
        <div className="flex items-center gap-4">
          {legal.map((link) => (
            <Link key={link.href} href={link.href} className="text-background/60 no-underline hover:text-background">
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-7 items-center justify-center rounded-full bg-background/10 text-background/85 transition-colors hover:bg-background/20"
              >
                <social.icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="footer-wordmark-clip relative overflow-hidden" aria-hidden>
        <span className="footer-wordmark absolute inset-x-0 top-0 text-center leading-none font-heading font-bold whitespace-nowrap text-background/10">
          me.inc
        </span>
      </div>
    </footer>
  )
}
