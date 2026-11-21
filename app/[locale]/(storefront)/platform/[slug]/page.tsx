import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { platformFeaturesContent, platformFeatures } from '../page'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isAr = locale === 'ar'
  const list = isAr ? platformFeaturesContent.ar : platformFeaturesContent.en
  const feature = list.find((f) => f.slug === slug)
  if (!feature) return { title: isAr ? 'المنصة - me.inc' : 'Platform - me.inc' }
  return {
    title: `${feature.title} - me.inc`,
    description: feature.description,
  }
}

export function generateStaticParams() {
  return platformFeatures.map((f) => ({ slug: f.slug }))
}

const integrationListContent = {
  en: [
    { name: 'Snowflake', type: 'Data Warehouse', status: 'Certified Native App' },
    { name: 'Google BigQuery', type: 'Data Warehouse', status: 'Certified Partner' },
    { name: 'Databricks', type: 'Lakehouse & Unity Catalog', status: 'Certified Partner' },
    { name: 'PostgreSQL', type: 'Relational Database', status: 'Official Connector' },
    { name: 'ClickHouse', type: 'Real-time Analytical DB', status: 'Official Connector' },
    { name: 'Amazon Redshift', type: 'Cloud Data Warehouse', status: 'Official Connector' },
    { name: 'dbt Cloud', type: 'Semantic Transformation', status: 'Bidirectional Sync' },
    { name: 'Slack', type: 'Team Collaboration', status: 'Live Bot Integration' },
  ],
  ar: [
    { name: 'Snowflake', type: 'مستودع بيانات سحابي', status: 'تطبيق أصيل معتمد' },
    { name: 'Google BigQuery', type: 'مستودع بيانات سحابي', status: 'شريك معتمد' },
    { name: 'Databricks', type: 'مستودع بيانات بحيري وكتالوج موحد', status: 'شريك معتمد' },
    { name: 'PostgreSQL', type: 'قاعدة بيانات علائقية', status: 'موصل رسمي' },
    { name: 'ClickHouse', type: 'قاعدة بيانات تحليلية فورية', status: 'موصل رسمي' },
    { name: 'Amazon Redshift', type: 'مستودع بيانات سحابي', status: 'موصل رسمي' },
    { name: 'dbt Cloud', type: 'تحويلات دلالية للبيانات', status: 'مزامنة ثنائية الاتجاه' },
    { name: 'Slack', type: 'تواصل وتعاون الفرق', status: 'روبوت مباشر وتنبيهات' },
  ],
}

export default async function PlatformDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const list = isAr ? platformFeaturesContent.ar : platformFeaturesContent.en

  const feature = list.find((f) => f.slug === slug)
  if (!feature) notFound()

  const isAgenticBi = slug === 'agentic-bi'
  const integrations = isAr ? integrationListContent.ar : integrationListContent.en

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-16">
        {/* Back navigation */}
        <div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground no-underline font-medium transition-colors"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {isAr ? 'العودة لنظرة عامة على المنصة' : 'Back to Platform Overview'}
          </Link>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-md">
            <feature.icon className="size-8" />
          </div>
          <Badge variant="new" className="mb-4">
            {isAr ? 'محرك المنصة' : 'Platform Engine'}
          </Badge>
          <h1 className="heading-1 text-foreground mb-4">
            {feature.title}
          </h1>
          <p className="font-heading text-xl text-primary font-semibold mb-4">
            {feature.tagline}
          </p>
          <p className="body text-muted-foreground max-w-2xl mb-8">
            {feature.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button render={<Link href="/demo" />} nativeButton={false} size="lg" variant="default">
              {isAr ? 'اختبر في البيئة التجريبية' : 'Test In Sandbox'} <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
            <Button render={<Link href="/docs" />} nativeButton={false} size="lg" variant="outline">
              {isAr ? 'قراءة التوثيق التقني' : 'Read Developer Docs'}
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div>
          <div className="text-center mb-10">
            <h2 className="heading-2 text-foreground">
              {isAr ? 'القدرات والمعمارية التقنية' : 'Capabilities & Architecture'}
            </h2>
            <p className="caption mt-2 text-muted-foreground">
              {isAr
                ? 'مصممة لتوفير الموثوقية التامة والشفافية وتوافق معايير شبكات البيانات الحديثة.'
                : 'Designed for reliability, transparency, and enterprise data mesh standards.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {feature.highlights.map((h, idx) => (
              <Card key={idx} className="p-6 border border-border flex items-start gap-4">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-base mb-1">{h}</h4>
                  <p className="caption text-muted-foreground">
                    {isAr
                      ? 'مؤتمتة بالكامل مع تدقيق مؤسسي، وتحقق مستمر عبر مسارات CI/CD، وتنفيذ فوري.'
                      : 'Fully automated with enterprise auditing, CI/CD validations, and real-time execution.'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Specific content for Integrations or Agentic BI */}
        {!isAgenticBi ? (
          <div>
            <div className="text-center mb-8">
              <h3 className="heading-3 text-foreground">
                {isAr ? 'دليل التكاملات المدعومة' : 'Supported Integrations Directory'}
              </h3>
              <p className="caption text-muted-foreground">
                {isAr
                  ? 'اربط مع مستودعات البيانات السحابية وقنوات المحادثة المعتمدة.'
                  : 'Connect to existing data warehouses and communication channels.'}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {integrations.map((item) => (
                <Card key={item.name} className="p-5 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-foreground text-sm">{item.name}</span>
                    <Badge variant="outline" className="text-[10px]">{item.status}</Badge>
                  </div>
                  <p className="caption text-xs text-muted-foreground">{item.type}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
              <div>
                <Badge variant="new" className="text-xs mb-2">
                  {isAr ? 'مسار عمل مبني بالكود' : 'Code-First Workflow'}
                </Badge>
                <h3 className="heading-3 text-foreground">
                  {isAr ? 'كيف يعمل ذكاء الأعمال الوكيلي تحت الغطاء' : 'How Agentic BI Works Under the Hood'}
                </h3>
                <p className="caption text-muted-foreground">
                  {isAr
                    ? 'من الفرع البرمجي في Git إلى لوحات تحكم مستقلة في بيئة الإنتاج.'
                    : 'From Git branch to production autonomous dashboards.'}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <span className="font-heading text-2xl font-black text-primary">01</span>
                <h4 className="font-heading font-semibold text-foreground text-sm">
                  {isAr ? 'تعريف النماذج الدلالية' : 'Define Semantic Models'}
                </h4>
                <p className="caption text-muted-foreground">
                  {isAr
                    ? 'حدد الجداول، وعلاقات الربط، والأبعاد، والمقاييس في ملفات YAML محفوظة في Git.'
                    : 'Specify tables, join relationships, dimensions, and measures in version-controlled YAML files.'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-heading text-2xl font-black text-primary">02</span>
                <h4 className="font-heading font-semibold text-foreground text-sm">
                  {isAr ? 'استعلامات الوكلاء المستقلة' : 'Autonomous Agent Querying'}
                </h4>
                <p className="caption text-muted-foreground">
                  {isAr
                    ? 'عندما يطرح المستخدمون أسئلة، يجوب الوكلاء المخطط الدلالي ويؤلفون كود SQL محسّناً بدقة.'
                    : 'When business users ask questions, agents traverse the semantic graph and compile optimized SQL.'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-heading text-2xl font-black text-primary">03</span>
                <h4 className="font-heading font-semibold text-foreground text-sm">
                  {isAr ? 'لوحات تحكم ذاتية الإصلاح' : 'Self-Healing Dashboards'}
                </h4>
                <p className="caption text-muted-foreground">
                  {isAr
                    ? 'عند تعديل أعمدة المستودع أو معادلات المؤشرات، يحدد الوكلاء التقارير المتأثرة ويقترحون طلبات سحب لتصحيحها.'
                    : 'When warehouse columns or formulas change, agents identify affected reports and propose pull requests.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}
