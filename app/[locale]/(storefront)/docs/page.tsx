import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Terminal, Code, Database, Key, Shield, ArrowRight, Search, FileText } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'التوثيق ومركز المطورين - me.inc' : 'Documentation - me.inc',
    description: isAr
      ? 'أدلة البدء السريع، والمراجع التقنية، وحزم SDK للبناء والتطوير مع منصة me.inc.'
      : 'Quickstarts, guides, and API reference for building with me.inc.',
  }
}

interface GuideItem {
  icon: typeof Terminal
  title: string
  description: string
  href: string
}

const docsContent = {
  en: {
    eyebrow: 'Documentation',
    heading: 'Everything you need to build with me.inc',
    subheading: 'Developer documentation, architectural deep-dives, SDK references, and step-by-step implementation tutorials.',
    searchPlaceholder: 'Search documentation, guides, and SDK methods...',
    popularHeading: 'Popular Guides & Documentation',
    exploreGuide: 'Explore guide',
    sdkBadge: 'TypeScript SDK',
    sdkHeading: 'Execute conversational queries in code',
    sdkSubtitle: 'Query your semantic catalog directly from any Node, React, or Python application.',
    playgroundButton: 'Open Interactive Playground',
    guides: [
      {
        icon: Terminal,
        title: '5-Minute Quickstart',
        description: 'Connect your cloud data warehouse and execute your first natural language query in under 5 minutes.',
        href: '/docs#quickstart',
      },
      {
        icon: Database,
        title: 'Connecting Data Warehouses',
        description: 'Detailed instructions for Snowflake, Google BigQuery, Databricks, PostgreSQL, and ClickHouse.',
        href: '/docs#warehouses',
      },
      {
        icon: Code,
        title: 'Semantic Modeling & Metrics',
        description: 'Define dimensions, measures, joins, and custom calculations using our declarative YAML/SQL specs.',
        href: '/docs#semantic',
      },
      {
        icon: Key,
        title: 'Embedded Analytics SDK',
        description: 'Integrate interactive charts and conversational agents into your own customer-facing SaaS product.',
        href: '/docs#embedded',
      },
      {
        icon: Shield,
        title: 'Security, VPC & Governance',
        description: 'Explore zero-storage data architecture, RBAC, SSO/SAML configuration, and audit logging.',
        href: '/docs#security',
      },
      {
        icon: FileText,
        title: 'REST API & Webhooks',
        description: 'Trigger asynchronous queries, sync metric definitions programmatically, and listen to data events.',
        href: '/docs#api',
      },
    ] as GuideItem[],
  },
  ar: {
    eyebrow: 'التوثيق ومركز المطورين',
    heading: 'كل ما تحتاجه للبناء والتطوير مع me.inc',
    subheading: 'دليل المطورين، وشروحات المعمارية العميقة، ومراجع حزم SDK، ودروس تطبيقية خطوة بخطوة.',
    searchPlaceholder: 'ابحث في التوثيق التقني، والأدلة، ودوال حزم SDK...',
    popularHeading: 'أشهر الأدلة والمستندات التقنية',
    exploreGuide: 'استعراض الدليل',
    sdkBadge: 'حزمة TypeScript SDK',
    sdkHeading: 'نفّذ استعلامات حوارية من خلال الكود البرمجي',
    sdkSubtitle: 'استعلم عن دليلك الدلالي مباشرة من أي تطبيق مبني بـ Node أو React أو Python.',
    playgroundButton: 'فتح ساحة التجارب التفاعلية',
    guides: [
      {
        icon: Terminal,
        title: 'البدء السريع في 5 دقائق',
        description: 'اربط مستودع بياناتك السحابي ونفذ أول استعلام باللغة الطبيعية في أقل من 5 دقائق.',
        href: '/docs#quickstart',
      },
      {
        icon: Database,
        title: 'ربط مستودعات البيانات',
        description: 'تعليمات تفصيلية لـ Snowflake و Google BigQuery و Databricks و PostgreSQL و ClickHouse.',
        href: '/docs#warehouses',
      },
      {
        icon: Code,
        title: 'النمذجة الدلالية والمقاييس',
        description: 'عرّف الأبعاد والقياسات والعلاقات والمعادلات الحسابية باستخدام ملفات YAML/SQL الصريحة.',
        href: '/docs#semantic',
      },
      {
        icon: Key,
        title: 'حزمة التحليلات المضمنة (SDK)',
        description: 'أدمج الرسوم البيانية التفاعلية ووكلاء الذكاء الاصطناعي مباشرة داخل منتجك البرمجي.',
        href: '/docs#embedded',
      },
      {
        icon: Shield,
        title: 'الأمان وشبكات VPC والحوكمة',
        description: 'استكشف معمارية انعدام تخزين البيانات، والصلاحيات (RBAC)، ودخول SSO، وسجلات التدقيق.',
        href: '/docs#security',
      },
      {
        icon: FileText,
        title: 'واجهات REST API والخطافات (Webhooks)',
        description: 'أطلق استعلامات غير متزامنة، وزامن تعريفات المقاييس برمجياً، واستمع لأحداث البيانات.',
        href: '/docs#api',
      },
    ] as GuideItem[],
  },
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? docsContent.ar : docsContent.en

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

          {/* Search bar mockup */}
          <div className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm">
            <Search className="size-5 text-muted-foreground" />
            <input
              type="text"
              readOnly
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="hidden sm:inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
          </div>
        </div>

        {/* Guides Grid */}
        <div>
          <h2 className="heading-2 text-foreground mb-8">{t.popularHeading}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.guides.map((guide) => (
              <Card key={guide.title} className="p-6 border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <guide.icon className="size-5" />
                  </div>
                  <h3 className="heading-4 text-foreground mb-2">{guide.title}</h3>
                  <p className="caption text-muted-foreground leading-relaxed">
                    {guide.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{t.exploreGuide}</span>
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Code Example Preview */}
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
            <div>
              <Badge variant="new" className="text-xs mb-2">{t.sdkBadge}</Badge>
              <h3 className="heading-3 text-foreground">{t.sdkHeading}</h3>
              <p className="caption text-muted-foreground">{t.sdkSubtitle}</p>
            </div>
            <Button render={<Link href="/demo" />} nativeButton={false} variant="outline" size="sm">
              {t.playgroundButton}
            </Button>
          </div>

          <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-6 font-mono text-xs text-zinc-100 leading-relaxed text-left ltr">
            <code>{`import { MeIncClient } from '@meinc/sdk';

const client = new MeIncClient({
  apiKey: process.env.MEINC_API_KEY,
});

// Run natural language query against governed semantic layer
const response = await client.ask({
  prompt: "What was our net customer churn rate in Q3 by plan tier?",
  format: "chart", // 'json' | 'chart' | 'sql'
});

console.log(response.sql); // Verified SQL executed on your warehouse
console.log(response.data); // Clean typed result rows
console.log(response.chartConfig); // Ready-to-render chart configuration`}</code>
          </pre>
        </div>
      </Container>
    </Section>
  )
}
