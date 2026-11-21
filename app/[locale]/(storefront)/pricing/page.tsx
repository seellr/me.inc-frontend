import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'الأسعار والخطط - me.inc' : 'Pricing - me.inc',
    description: isAr
      ? 'باقات وأسعار واضحة ومناسبة لفرق البيانات الحديثة. ابدأ مجاناً وتوسّع مع نمو بياناتك.'
      : 'Transparent pricing for modern data teams. Start free, scale as your team and data grow.',
  }
}

interface Tier {
  name: string
  badge: string
  price: string
  frequency: string
  description: string
  features: string[]
  cta: string
  href: string
  popular: boolean
}

const pricingContent = {
  en: {
    eyebrow: 'Plans & Pricing',
    heading: 'Simple, predictable pricing for modern data teams',
    subheading: 'Choose the plan that fits your growth stage. Scale effortlessly from exploratory data chats to enterprise-grade governed analytics.',
    mostPopular: 'Most Popular',
    includedCaps: 'Included capabilities:',
    trustBadges: [
      { title: 'Zero-Data Storage', desc: 'Raw queries run in your database, not ours.' },
      { title: 'Instant 5-Minute Setup', desc: 'Connect warehouse credentials in minutes.' },
      { title: 'Transparent Limits', desc: 'No unexpected overage bills or compute fees.' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Have questions about billing, plans, or deployment? We are here to help.',
    ctaCardTitle: 'Need a custom enterprise architecture?',
    ctaCardSubtitle: 'Talk with our solutions engineers about custom LLM fine-tuning, VPC peering, and enterprise compliance.',
    ctaCardButton: 'Talk to Solutions Engineers',
    tiers: [
      {
        name: 'Starter',
        badge: 'Free Forever',
        price: '$0',
        frequency: 'free forever',
        description: 'Perfect for small teams and individuals exploring conversational analytics.',
        features: [
          'Up to 5 team members',
          'Conversational AI queries (500/mo)',
          '3 interactive dashboards',
          'PostgreSQL & MySQL connectors',
          'Standard community support',
          '7-day data history',
        ],
        cta: 'Start Free',
        href: '/login',
        popular: false,
      },
      {
        name: 'Pro',
        badge: 'Most Popular',
        price: '$49',
        frequency: 'per user / month',
        description: 'For growing teams requiring robust metric governance, custom data apps, and unlimited queries.',
        features: [
          'Unlimited team members',
          'Unlimited AI queries & insights',
          'Unlimited interactive dashboards',
          'Full Metrics Catalog & versioning',
          'Snowflake, BigQuery & Databricks',
          'Scheduled email & Slack alerts',
          'Embedded analytics SDK access',
          'Priority support (2h response time)',
        ],
        cta: 'Start 14-Day Free Trial',
        href: '/login',
        popular: true,
      },
      {
        name: 'Enterprise',
        badge: 'Custom Tailored',
        price: 'Custom',
        frequency: 'billed annually',
        description: 'Mission-critical governance, dedicated VPC deployments, custom LLMs, and enterprise SLAs.',
        features: [
          'Everything in Pro plan',
          'Dedicated VPC or On-Prem deployment',
          'Fine-tuned private AI models',
          'SAML SSO & SCIM directory sync',
          '99.99% uptime SLA',
          'Custom role-based permissions (RBAC)',
          'Dedicated Customer Success Manager',
          'SOC2 Type II & HIPAA compliance',
        ],
        cta: 'Contact Sales',
        href: '/demo',
        popular: false,
      },
    ] as Tier[],
    faqs: [
      {
        q: 'Can I change or cancel my plan at any time?',
        a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your account settings. When upgrading, changes take effect immediately with prorated billing.',
      },
      {
        q: 'How does the 14-day Pro trial work?',
        a: 'You get full access to all Pro features with no restrictions. No credit card is required to start your trial. At the end of 14 days, you can choose to subscribe or automatically revert to the Starter plan.',
      },
      {
        q: 'Is my data secure and private?',
        a: 'Yes. me.inc operates with a zero-storage architecture for raw database rows: your underlying data never leaves your infrastructure. Only semantic metadata and aggregated results pass through our secure pipelines, and your data is never used to train third-party AI models.',
      },
      {
        q: 'Do you offer discounts for startups or non-profits?',
        a: 'We offer special pricing for early-stage startups (up to $5M funding) and qualifying non-profit organizations. Reach out to our team at partners@me.inc to apply.',
      },
      {
        q: 'What data sources can I connect?',
        a: 'We support all major cloud data warehouses including Snowflake, Google BigQuery, Databricks, PostgreSQL, MySQL, ClickHouse, Amazon Redshift, and DuckDB.',
      },
    ],
  },
  ar: {
    eyebrow: 'الخطط والأسعار',
    heading: 'أسعار بسيطة وشفافة لفرق البيانات الحديثة',
    subheading: 'اختر الباقة المناسبة لمرحلة نموك. تدرّج بسهولة من المحادثات الاستكشافية إلى التحليلات المعتمدة والمنظمة للمؤسسات.',
    mostPopular: 'الأكثر طلباً',
    includedCaps: 'المميزات المتضمنة:',
    trustBadges: [
      { title: 'بدون تخزين للبيانات', desc: 'الاستعلامات تُنفذ مباشرة في قاعدة بياناتك الخاصة.' },
      { title: 'إعداد سريع في 5 دقائق', desc: 'اربط مستودع البيانات الخاص بك خلال دقائق معدودة.' },
      { title: 'حدود واضحة وموثوقة', desc: 'لا رسوم خفية أو تكاليف استهلاك حوسبة مفاجئة.' },
    ],
    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'هل لديك استفسارات حول الفوترة أو الخطط أو النشر؟ نحن هنا للمساعدة.',
    ctaCardTitle: 'هل تحتاج إلى بنية مخصصة للمؤسسات الكبرى؟',
    ctaCardSubtitle: 'تحدث مع مهندسي الحلول لدينا حول تخصيص نماذج الذكاء الاصطناعي، والربط عبر VPC، وتوافق المعايير المؤسسية.',
    ctaCardButton: 'تواصل مع مهندسي الحلول',
    tiers: [
      {
        name: 'البداية (Starter)',
        badge: 'مجاني دائماً',
        price: '$0',
        frequency: 'مجاناً مدى الحياة',
        description: 'مثالي للفرق الصغيرة والأفراد الراغبين في تجربة التحليلات الحوارية الذكية.',
        features: [
          'حتى 5 أعضاء في الفريق',
          'استعلامات حوارية بالذكاء الاصطناعي (500 شهرياً)',
          '3 لوحات تحكم تفاعلية',
          'ربط مع PostgreSQL و MySQL',
          'دعم المجتمع القياسي',
          'سجل بيانات لمدة 7 أيام',
        ],
        cta: 'ابدأ مجاناً',
        href: '/login',
        popular: false,
      },
      {
        name: 'المحترف (Pro)',
        badge: 'الأكثر شعبية',
        price: '$49',
        frequency: 'لكل مستخدم / شهرياً',
        description: 'للفرق النامية التي تحتاج إلى حوكمة دقيقة للمؤشرات، وتطبيقات بيانات مخصصة، واستعلامات غير محدودة.',
        features: [
          'عدد مستخدمين غير محدود',
          'استعلامات وتحليلات ذكاء اصطناعي غير محدودة',
          'لوحات تحكم تفاعلية غير محدودة',
          'دليل المقاييس الكامل مع حفظ الإصدارات',
          'ربط مع Snowflake و BigQuery و Databricks',
          'تنبيهات مجدولة عبر البريد و Slack',
          'حزمة SDK للتحليلات المضمنة',
          'دعم مخصص بأولوية (خلال ساعتين)',
        ],
        cta: 'ابدأ تجربة مجانية لمدة 14 يوماً',
        href: '/login',
        popular: true,
      },
      {
        name: 'المؤسسات (Enterprise)',
        badge: 'مخصص بالكامل',
        price: 'مخصص',
        frequency: 'يُفوتر سنوياً',
        description: 'حوكمة فائقة، ونشر سحابي خاص (VPC)، ونماذج ذكاء اصطناعي مخصصة، واتفاقيات مستوى خدمة صارمة.',
        features: [
          'كل مميزات باقة المحترف (Pro)',
          'نشر مخصص على سحابة خاصة (VPC) أو داخل بيئتكم',
          'نماذج ذكاء اصطناعي خاصة ومُدربة بدقة',
          'دخول موحد SAML SSO ومزامنة SCIM',
          'ضمان تشغيل بنسبة 99.99% (SLA)',
          'صلاحيات وصول دقيقة ومخصصة (RBAC)',
          'مدير نجاح عملاء مخصص للمؤسسة',
          'توافق كامل مع معايير SOC2 و HIPAA',
        ],
        cta: 'تواصل مع المبيعات',
        href: '/demo',
        popular: false,
      },
    ] as Tier[],
    faqs: [
      {
        q: 'هل يمكنني تغيير أو إلغاء اشتراكي في أي وقت؟',
        a: 'نعم بكل تأكيد. يمكنك ترقية أو خفض باقتك أو إلغاء الاشتراك في أي وقت من إعدادات حسابك. عند الترقية، تسري التعديلات فوراً مع حساب الفارق بالتناسب.',
      },
      {
        q: 'كيف تعمل التجربة المجانية لباقة المحترف (Pro) لمدة 14 يوماً؟',
        a: 'تحصل على وصول كامل لكافة مميزات باقة المحترف دون أي قيود، وبدون الحاجة لإدخال بطاقة ائتمانية. بعد 14 يوماً، يمكنك الترقية أو العودة تلقائياً للباقة المجانية.',
      },
      {
        q: 'هل بياناتي محمية ومضمونة الخصوصية؟',
        a: 'نعم، نحن نعتمد بنية "انعدام تخزين البيانات الخام": بياناتك لا تغادر مستودعك أبداً. فقط البيانات الوصفية والنتائج الإحصائية التجميعية تمر عبر أنظمتنا المشفرة، ولا تُستخدم بياناتك لتدريب نماذج خارجية.',
      },
      {
        q: 'هل تقدمون خصومات للشركات الناشئة أو المؤسسات غير الربحية؟',
        a: 'نعم، نوفر تسعيراً تشجيعياً خاصاً للشركات الناشئة والمؤسسات غير الربحية. تواصل معنا عبر البريد partners@me.inc لتقديم طلبك.',
      },
      {
        q: 'ما هي مصادر البيانات التي يمكنني ربطها؟',
        a: 'ندعم مستودعات البيانات السحابية الرئيسية مثل Snowflake و Google BigQuery و Databricks و PostgreSQL و MySQL و ClickHouse و Amazon Redshift و DuckDB.',
      },
    ],
  },
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? pricingContent.ar : pricingContent.en

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

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {t.tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col justify-between p-8 transition-shadow hover:shadow-xl ${
                tier.popular
                  ? 'border-2 border-primary ring-2 ring-primary/20'
                  : 'border border-border'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="new" className="px-3 py-1 font-semibold uppercase tracking-wider">
                    <Sparkles className="size-3.5 inline mr-1" /> {t.mostPopular}
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="heading-3 text-foreground">{tier.name}</h3>
                  {!tier.popular && (
                    <Badge variant="outline" className="text-xs">
                      {tier.badge}
                    </Badge>
                  )}
                </div>
                <p className="caption mt-3 text-muted-foreground">{tier.description}</p>

                <div className="mt-6 flex items-baseline gap-2 border-b border-border pb-6">
                  <span className="heading-1 font-extrabold text-foreground">{tier.price}</span>
                  <span className="text-xs font-medium text-muted-foreground">{tier.frequency}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted-foreground">
                    {t.includedCaps}
                  </p>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="size-4 shrink-0 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  render={<Link href={tier.href} />}
                  nativeButton={false}
                  variant={tier.popular ? 'default' : 'outline'}
                  className="w-full justify-center"
                  size="lg"
                >
                  {tier.cta} <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 rounded-2xl bg-muted/40 p-6 border border-border">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{t.trustBadges[0].title}</p>
              <p className="text-xs text-muted-foreground">{t.trustBadges[0].desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{t.trustBadges[1].title}</p>
              <p className="text-xs text-muted-foreground">{t.trustBadges[1].desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{t.trustBadges[2].title}</p>
              <p className="text-xs text-muted-foreground">{t.trustBadges[2].desc}</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mx-auto w-full max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="heading-2 text-foreground">{t.faqTitle}</h2>
            <p className="caption mt-2 text-muted-foreground">
              {t.faqSubtitle}
            </p>
          </div>

          <Accordion className="w-full border-border">
            {t.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-start font-medium text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <Card className="flex flex-col items-center justify-between gap-6 bg-primary text-primary-foreground p-10 sm:flex-row">
          <div>
            <h3 className="heading-3 text-primary-foreground">{t.ctaCardTitle}</h3>
            <p className="text-sm text-primary-foreground/80 mt-1">
              {t.ctaCardSubtitle}
            </p>
          </div>
          <Button
            render={<Link href="/demo" />}
            nativeButton={false}
            variant="secondary"
            size="lg"
            className="shrink-0"
          >
            {t.ctaCardButton}
          </Button>
        </Card>
      </Container>
    </Section>
  )
}
