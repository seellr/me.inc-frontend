import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Handshake, Layers, Award, CheckCircle2, ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'برنامج الشراكات - me.inc' : 'Partnerships - me.inc',
    description: isAr
      ? 'انضم إلى منظومة شركاء me.inc: شركاء الحلول والتقنية والقنوات السحابية.'
      : 'Join the me.inc partner ecosystem: Solutions, Technology, and Cloud partnerships.',
  }
}

interface Track {
  icon: typeof Handshake
  title: string
  badge: string
  description: string
  benefits: string[]
}

const partnersContent = {
  en: {
    eyebrow: 'Partnerships',
    heading: 'Grow your business with the me.inc ecosystem',
    subheading: 'Collaborate with us to deliver intelligent, code-first data experiences to forward-thinking organizations worldwide.',
    partnerBenefitsLabel: 'Partner Benefits:',
    applyTrackButton: 'Apply for this track',
    formHeading: 'Become a me.inc Partner',
    formSubtitle: 'Tell us about your organization and how we can collaborate.',
    companyName: 'Company Name',
    website: 'Website',
    contactEmail: 'Contact Email',
    partnerTrack: 'Partner Track',
    partnerTrackPlaceholder: 'Solution / Technology / Cloud',
    howPartner: 'How would you like to partner?',
    howPartnerPlaceholder: 'Brief overview of joint customer opportunities or technical integration plans...',
    submitButton: 'Submit Partner Application',
    tracks: [
      {
        icon: Handshake,
        title: 'Solution & Consulting Partners',
        badge: 'Advisory & Delivery',
        description: 'Data consultancies, system integrators, and boutique analytics firms delivering AI transformations for global enterprises.',
        benefits: [
          'Generous revenue share on referred subscriptions',
          'Dedicated partner sandbox environments',
          'Joint go-to-market and co-selling opportunities',
          'Direct technical enablement and certification',
        ],
      },
      {
        icon: Layers,
        title: 'Technology & ISV Partners',
        badge: 'Ecosystem & APIs',
        description: 'Data warehouses, semantic modeling tools, orchestrators, and SaaS providers integrating natively with the me.inc engine.',
        benefits: [
          'Featured placement in me.inc Integrations Directory',
          'Early access to private SDKs and beta APIs',
          'Joint engineering sprints and connector maintenance',
          'Co-authored technical case studies & blog posts',
        ],
      },
      {
        icon: Award,
        title: 'Cloud & Reseller Partners',
        badge: 'Enterprise Channels',
        description: 'Cloud marketplace providers and enterprise distributors offering streamlined procurement and consolidated billing.',
        benefits: [
          'AWS, Google Cloud, and Azure Marketplace listings',
          'Custom enterprise deal structuring support',
          'Dedicated account executives and sales engineers',
          'Tiered margin incentives and performance bonuses',
        ],
      },
    ] as Track[],
  },
  ar: {
    eyebrow: 'منظومة الشراكات',
    heading: 'نمِّ أعمالك مع منظومة شركاء me.inc العالمية',
    subheading: 'تعاون معنا لتقديم حلول بيانات ذكية مبنية بالكود للمؤسسات والشركات الطموحة حول العالم.',
    partnerBenefitsLabel: 'مزايا الشراكة:',
    applyTrackButton: 'التقديم في هذا المسار',
    formHeading: 'انضم كشريك رسمي لـ me.inc',
    formSubtitle: 'أخبرنا عن مؤسستك والفرص المشتركة التي ترغب في تحقيقها معنا.',
    companyName: 'اسم الشركة',
    website: 'الموقع الإلكتروني',
    contactEmail: 'البريد الإلكتروني المهني',
    partnerTrack: 'مسار الشراكة',
    partnerTrackPlaceholder: 'حلول واستشارات / تقنية وتكامل / موزعين وسحابة',
    howPartner: 'كيف ترغب في التعاون معنا؟',
    howPartnerPlaceholder: 'نبذة مختصرة عن العملاء المشتركين أو خطط التكامل التقني المقترحة...',
    submitButton: 'إرسال طلب الشراكة',
    tracks: [
      {
        icon: Handshake,
        title: 'شركاء الحلول والاستشارات',
        badge: 'استشارات وتنفيذ',
        description: 'شركات استشارات البيانات ومكاملو الأنظمة الذين يقدمون التحول بالذكاء الاصطناعي للمؤسسات.',
        benefits: [
          'نسبة مجزية من إيرادات الاشتراكات المحالة',
          'بيئات اختبار وتطوير خاصة ومجانية للشركاء',
          'فرص تسويق ومبيعات مشتركة في الأسواق المستهدفة',
          'تدريب تقني مباشر وشهادات اعتماد رسمية',
        ],
      },
      {
        icon: Layers,
        title: 'الشركاء التقنيون ومطورو البرمجيات',
        badge: 'تكاملات وواجهات برمجة',
        description: 'مستودعات البيانات، وأدوات النمذجة الدلالية، ومزودو برمجيات SaaS المترابطون مباشرة مع محرك me.inc.',
        benefits: [
          'إدراج مميز في دليل تكاملات me.inc الرسمي',
          'وصول مبكر لحزم SDK وواجهات API التجريبية',
          'دورات تطوير هندسية مشتركة لصيانة الموصلات',
          'كتابة ونشر دراسات حالة ومقالات تقنية مشتركة',
        ],
      },
      {
        icon: Award,
        title: 'الشركاء السحابيون والموزعون',
        badge: 'قنوات المؤسسات الكبرى',
        description: 'منصات الأسواق السحابية والموزعون المعتمدون الذين يقدمون فوترة موحدة وإجراءات تعاقد ميسرة.',
        benefits: [
          'إدراج في متاجر AWS و Google Cloud و Azure',
          'دعم مباشر لهيكلة الصفقات المؤسسية الكبرى',
          'فريق مبيعات ومهندسو حلول مخصصون للشركاء',
          'هوامش ربح تصاعدية وحوافز أداء مجزية',
        ],
      },
    ] as Track[],
  },
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? partnersContent.ar : partnersContent.en

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-16">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="eyebrow" className="mb-4">
            {t.eyebrow}
          </Badge>
          <h1 className="heading-1 mb-6 text-foreground">
            {t.heading}
          </h1>
          <p className="body max-w-2xl text-muted-foreground">
            {t.subheading}
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {t.tracks.map((track) => (
            <Card key={track.title} className="flex flex-col justify-between p-8 border border-border">
              <div>
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <track.icon className="size-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="heading-3 text-foreground">{track.title}</h3>
                </div>
                <Badge variant="outline" className="text-xs mb-3">{track.badge}</Badge>
                <p className="caption text-muted-foreground leading-relaxed">
                  {track.description}
                </p>

                <div className="mt-6 space-y-2 border-t border-border pt-4">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted-foreground">
                    {t.partnerBenefitsLabel}
                  </p>
                  <ul className="space-y-2">
                    {track.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-foreground">
                        <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-2">
                <Button variant="outline" className="w-full justify-center">
                  {t.applyTrackButton}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="heading-2 text-foreground">{t.formHeading}</h2>
            <p className="caption mt-2 text-muted-foreground">
              {t.formSubtitle}
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">{t.companyName}</label>
                <Input placeholder={isAr ? 'شركة الأفق الرقمي' : 'Acme Analytics'} className="mt-1" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">{t.website}</label>
                <Input placeholder="https://company.com" className="mt-1" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">{t.contactEmail}</label>
                <Input type="email" placeholder="partners@company.com" className="mt-1" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">{t.partnerTrack}</label>
                <Input placeholder={t.partnerTrackPlaceholder} className="mt-1" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">{t.howPartner}</label>
              <Input placeholder={t.howPartnerPlaceholder} className="mt-1" />
            </div>

            <Button type="button" size="lg" className="w-full justify-center mt-4">
              {t.submitButton} <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  )
}
