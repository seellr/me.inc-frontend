import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cpu, Network, ArrowRight, CheckCircle2, GitBranch, Database, ShieldCheck } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'معمارية المنصة - me.inc' : 'Platform Architecture - me.inc',
    description: isAr
      ? 'استكشف منصة me.inc: ذكاء الأعمال الوكيلي، والتحليلات المعتمدة على الكود، والربط مع مستودعات البيانات السحابية.'
      : 'Explore the me.inc platform: Agentic BI, code-first analytics, and enterprise data warehouse integrations.',
  }
}

export interface PlatformFeatureData {
  slug: string
  title: string
  tagline: string
  description: string
  icon: typeof Cpu
  highlights: string[]
}

export const platformFeaturesContent: Record<'en' | 'ar', PlatformFeatureData[]> = {
  en: [
    {
      slug: 'agentic-bi',
      title: 'Agentic BI',
      tagline: 'Build & maintain dashboards in code',
      description: 'Transform traditional manual business intelligence with autonomous data agents that build, refactor, and self-heal dashboards entirely through version-controlled code.',
      icon: Cpu,
      highlights: [
        'Autonomous SQL generation with zero hallucination guarantee',
        'GitOps for BI: pull request reviews and CI/CD test automation for metrics',
        'Self-healing query planner that repairs broken joins when schemas drift',
        'Multi-agent task decomposition for complex executive inquiries',
      ],
    },
    {
      slug: 'integrations',
      title: 'Integrations & Connectors',
      tagline: 'Use the tools you already love',
      description: 'Connect effortlessly to your existing data stack. Direct push-down query support for major warehouses, orchestrators, reverse ETL, and team messengers.',
      icon: Network,
      highlights: [
        'Native pushdown connectors: Snowflake, BigQuery, Databricks, PostgreSQL, ClickHouse',
        'dbt Cloud bidirectional metric and semantic layer synchronization',
        'Enterprise notifications via Slack, Microsoft Teams, and Webhooks',
        'Figma Code Connect and vector export for design team workflows',
      ],
    },
  ],
  ar: [
    {
      slug: 'agentic-bi',
      title: 'ذكاء الأعمال الوكيلي (Agentic BI)',
      tagline: 'ابنِ لوحات التحكم وقم بصيانتها ككود برمجي',
      description: 'غيّر مفهوم ذكاء الأعمال التقليدي عبر وكلاء بيانات مستقلين يقومون ببناء وتحديث وإصلاح لوحات التحكم ذاتياً عبر كود محفوظ الإصدارات.',
      icon: Cpu,
      highlights: [
        'توليد استعلامات SQL ذاتياً مع ضمان رياضي بعدم حدوث هلوسة',
        'منهجية GitOps لذكاء الأعمال: مراجعة طلبات السحب (PRs) واختبارات CI/CD للمقاييس',
        'مخطط استعلامات ذاتي الإصلاح يعالج علاقات الربط عند تغير هيكل البيانات',
        'تفكيك الاستعلامات التنفيذية المعقدة إلى مهام متوازية بين وكلاء متعددين',
      ],
    },
    {
      slug: 'integrations',
      title: 'التكاملات والربط السحابي',
      tagline: 'استخدم الأدوات التي تفضلها بالفعل',
      description: 'اربط بسلاسة مع منظومة بياناتك الحالية. دعم مباشر لتنفيذ الاستعلامات داخل مستودعات البيانات الكبرى، وأدوات التنظيم، وقنوات المحادثة.',
      icon: Network,
      highlights: [
        'موصلات أصيلة: Snowflake و BigQuery و Databricks و PostgreSQL و ClickHouse',
        'مزامنة ثنائية الاتجاه للمقاييس والطبقة الدلالية مع dbt Cloud',
        'إشعارات وتنبيهات فورية للمؤسسات عبر Slack و Microsoft Teams والخطافات البرمجية',
        'تكامل Figma Code Connect وتصدير الرسوم المتجهة لفرق التصميم والمنتجات',
      ],
    },
  ],
}

export const platformFeatures = platformFeaturesContent.en

export default async function PlatformOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const features = isAr ? platformFeaturesContent.ar : platformFeaturesContent.en

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-16">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="eyebrow" className="mb-4">
            {isAr ? 'محرك المنصة' : 'Platform Engine'}
          </Badge>
          <h1 className="heading-1 mb-6 text-foreground">
            {isAr
              ? 'الأساس التقني لذكاء البيانات المستقل والموثوق'
              : 'The foundation for autonomous data intelligence'}
          </h1>
          <p className="body max-w-2xl text-muted-foreground">
            {isAr
              ? 'اكتشف المعمارية فائقة الأداء التي تشغل me.inc: تعريف المقاييس بالكود البرمجي، والتنفيذ الوكيلي الذكي، وربط المستودعات دون تخزين للبيانات.'
              : 'Discover the high-performance architecture powering me.inc: code-first metric definitions, agentic execution, and zero-storage warehouse connectivity.'}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feat) => (
            <Card key={feat.slug} className="p-8 border border-border flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <feat.icon className="size-6" />
                </div>
                <h3 className="heading-3 text-foreground mb-1">{feat.title}</h3>
                <p className="font-semibold text-xs text-primary mb-3">{feat.tagline}</p>
                <p className="caption text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>

                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    {isAr ? 'أبرز القدرات:' : 'Key Highlights:'}
                  </p>
                  <ul className="space-y-2">
                    {feat.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-foreground">
                        <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-2">
                <Button
                  render={<Link href={`/platform/${feat.slug}`} />}
                  nativeButton={false}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>{isAr ? `استكشف ${feat.title}` : `Explore ${feat.title}`}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Architecture Specs */}
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
          <h3 className="heading-3 text-foreground mb-6 text-center">
            {isAr ? 'أبرز معايير معمارية المنصة' : 'Platform Architecture Highlights'}
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center p-4">
              <Database className="size-8 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-foreground text-sm">
                {isAr ? 'تنفيذ مباشر بالمستودع' : 'Pushdown Execution'}
              </h4>
              <p className="caption text-muted-foreground mt-1">
                {isAr
                  ? 'تُترجم الاستعلامات إلى كود SQL أصيل يُنفذ مباشرة في المستودع دون نقل للبيانات الخام.'
                  : 'Queries compile directly into warehouse-native SQL without transferring raw data.'}
              </p>
            </div>
            <div className="text-center p-4">
              <GitBranch className="size-8 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-foreground text-sm">
                {isAr ? 'إدارة عبر مسارات GitOps' : 'GitOps Workflows'}
              </h4>
              <p className="caption text-muted-foreground mt-1">
                {isAr
                  ? 'التعامل مع مؤشرات الأداء بنفس انضباط هندسة البرمجيات: فروع برمجية، وطلبات دمج، واختبارات آلية.'
                  : 'Treat KPI logic with the rigor of production software: branches, PRs, and CI tests.'}
              </p>
            </div>
            <div className="text-center p-4">
              <ShieldCheck className="size-8 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-foreground text-sm">
                {isAr ? 'حوكمة مؤسسية شاملة' : 'Enterprise Governance'}
              </h4>
              <p className="caption text-muted-foreground mt-1">
                {isAr
                  ? 'صلاحيات وصول دقيقة، وعزل متعدد المستأجرين عبر رموز JWT المشفرة، وتوافق تام مع SOC2.'
                  : 'Role-based access control, cryptographic JWT tenant isolation, and SOC2 compliance.'}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
