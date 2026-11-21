import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, LayoutGrid, Database, Layers, BarChart3, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'باقة المنتجات - me.inc' : 'Product Suite - me.inc',
    description: isAr
      ? 'استكشف باقة منتجات me.inc: التحليلات الحوارية، وتطبيقات البيانات، ودليل المقاييس، والتحليلات المضمنة، ولوحات التحكم التفاعلية.'
      : 'Explore the full me.inc suite: conversational analytics, data apps, metrics catalog, embedded analytics, and interactive dashboards.',
  }
}

export interface ProductItemData {
  slug: string
  title: string
  tagline: string
  description: string
  icon: typeof MessageSquare
  badge: string
  color: string
  capabilities: string[]
}

export const productsContent: Record<'en' | 'ar', ProductItemData[]> = {
  en: [
    {
      slug: 'conversational-analytics',
      title: 'Conversational Analytics',
      tagline: 'Ask AI questions in plain English',
      description: 'Empower everyone in your organization to explore data using natural language, backed by deterministic SQL generation and verified semantic guardrails.',
      icon: MessageSquare,
      badge: 'AI-First',
      color: 'from-violet-500 to-indigo-600',
      capabilities: [
        'Natural language queries in English and Arabic',
        'Automated semantic SQL generation without hallucinations',
        'Instant chart recommendations and drill-downs',
        'Slack and Microsoft Teams native bots',
      ],
    },
    {
      slug: 'data-apps',
      title: 'Data Apps',
      tagline: 'Build apps on governed data',
      description: 'Transform your metrics into bespoke internal tools, workflow automations, and operational interfaces without writing custom backend boilerplate.',
      icon: LayoutGrid,
      badge: 'Low-Code',
      color: 'from-sky-400 to-blue-600',
      capabilities: [
        'Drag-and-drop reactive component builder',
        'Row-level security and permission scopes',
        'Write-back triggers into CRM and ERP systems',
        'Automated scheduled report distribution',
      ],
    },
    {
      slug: 'metrics-catalog',
      title: 'Metrics Catalog',
      tagline: 'Every KPI in one trusted place',
      description: 'The single source of truth for your business metrics. Define formulas once in code and ensure every department looks at identical numbers.',
      icon: Database,
      badge: 'Governance',
      color: 'from-emerald-400 to-teal-600',
      capabilities: [
        'Git-controlled metric definition files (YAML/SQL)',
        'Automated lineage DAG visualization',
        'Anomaly detection and trend alerts',
        'Bidirectional dbt Cloud synchronization',
      ],
    },
    {
      slug: 'embedded-analytics',
      title: 'Embedded Analytics',
      tagline: 'AI-powered insights anywhere',
      description: 'Bring white-labeled conversational analytics and interactive dashboards directly into your SaaS product with our zero-iframe developer SDK.',
      icon: Layers,
      badge: 'SDK & APIs',
      color: 'from-pink-400 to-rose-600',
      capabilities: [
        'Zero-iframe lightweight web component SDK',
        'Multi-tenant cryptographically signed token auth',
        'Custom CSS-in-JS style matching your brand',
        'Full TypeScript client library and webhooks',
      ],
    },
    {
      slug: 'dashboards',
      title: 'Interactive Dashboards',
      tagline: 'Dig into every number',
      description: 'Ultra-fast, interactive visual dashboards built for speed. Slice, filter, pivot, and drill down into sub-second analytics without database strain.',
      icon: BarChart3,
      badge: 'Performance',
      color: 'from-amber-400 to-orange-600',
      capabilities: [
        'Sub-second query response via semantic cache',
        'Dynamic cross-filtering across all widgets',
        'Collaborative comments, annotations, and sharing',
        'Export to high-res PDF, PNG, CSV, and Figma',
      ],
    },
  ],
  ar: [
    {
      slug: 'conversational-analytics',
      title: 'التحليلات الحوارية',
      tagline: 'اسأل الذكاء الاصطناعي بلغة طبيعية',
      description: 'مكّن كل فرد في مؤسستك من استكشاف البيانات باستخدام لغة طبيعية، مدعومة بتوليد دقيق لاستعلامات SQL وضوابط دلالية معتمدة.',
      icon: MessageSquare,
      badge: 'ذكاء اصطناعي أولاً',
      color: 'from-violet-500 to-indigo-600',
      capabilities: [
        'استعلامات باللغة الطبيعية بالعربية والإنجليزية بدقة فائقة',
        'توليد استعلامات SQL مؤكدة خالية تماماً من الهلوسة',
        'اقتراحات فورية للمخططات البيانية واستكشاف تفصيلي',
        'روبوتات مدمجة ومباشرة لقنوات Slack و Microsoft Teams',
      ],
    },
    {
      slug: 'data-apps',
      title: 'تطبيقات البيانات',
      tagline: 'ابنِ تطبيقات على بيانات موثوقة',
      description: 'حوّل مقاييسك إلى أدوات داخلية مخصصة، وأتمتة لمسارات العمل، وواجهات تشغيلية دون الحاجة لكتابة كود برمجي خلفي معقد.',
      icon: LayoutGrid,
      badge: 'برمجة منخفضة (Low-Code)',
      color: 'from-sky-400 to-blue-600',
      capabilities: [
        'أداة بناء مرئية للمكونات التفاعلية بالسحب والإفلات',
        'صلاحيات وصول دقيقة على مستوى كل صف بياني',
        'محفزات كتابة وتحديث تلقائي لأنظمة CRM و ERP',
        'توزيع تقارير مجدولة آلياً للمسؤولين وأصحاب القرار',
      ],
    },
    {
      slug: 'metrics-catalog',
      title: 'دليل المقاييس',
      tagline: 'كل المؤشرات في مكان واحد موحد',
      description: 'المصدر الموحد والموثوق لكل مؤشرات أداء شركتك. عرّف المعادلات الحسابية مرة واحدة بالكود واضمن اتفاق الجميع على نفس الأرقام.',
      icon: Database,
      badge: 'حوكمة موحدة',
      color: 'from-emerald-400 to-teal-600',
      capabilities: [
        'ملفات تعريف المقاييس محفوظة الإصدارات عبر Git (YAML/SQL)',
        'رسم بياني مرئي يوضح مسار وتدفق البيانات (DAG)',
        'اكتشاف الشذوذ والانحرافات وتنبيهات فورية بالاتجاهات',
        'مزامنة ثنائية الاتجاه مع dbt Cloud',
      ],
    },
    {
      slug: 'embedded-analytics',
      title: 'التحليلات المضمنة',
      tagline: 'رؤى ذكية ومضمنة في أي مكان',
      description: 'أضف تحليلات حوارية ولوحات تحكم تفاعلية بهويتك التجارية مباشرة داخل برمجياتك عبر حزمة SDK الخفيفة بدون iframe.',
      icon: Layers,
      badge: 'حزم SDK وواجهات برمجة',
      color: 'from-pink-400 to-rose-600',
      capabilities: [
        'حزمة مكونات ويب خفيفة تعمل مباشرة بدون إطارات iframe',
        'مصادقة آمنة متعددة المستأجرين عبر رموز JWT مشفرة',
        'تخصيص كامل للألوان والتنسيقات لتطابق علامتك التجارية',
        'مكتبة عميل TypeScript متكاملة ودعم الخطافات البرمجية',
      ],
    },
    {
      slug: 'dashboards',
      title: 'لوحات تحكم تفاعلية',
      tagline: 'استكشف كل رقم بتفاصيله الدقيقة',
      description: 'لوحات تحكم بصرية فائقة السرعة مصممة للأداء العالي. صفِّ وجمّع واستكشف البيانات في أجزاء من الثانية دون إجهاد لقاعدة بياناتك.',
      icon: BarChart3,
      badge: 'أداء فائق',
      color: 'from-amber-400 to-orange-600',
      capabilities: [
        'استجابة فورية في أجزاء من الثانية عبر التخزين الدلالي المؤقت',
        'تصفية تفاعلية متزامنة عبر كافة عناصر اللوحة',
        'مشاركة وملاحظات وتعليقات تعاونية بين أعضاء الفريق',
        'تصدير عالي الدقة بصيغ PDF و PNG و CSV ومكونات Figma',
      ],
    },
  ],
}

export const productList = productsContent.en

export default async function ProductOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const products = isAr ? productsContent.ar : productsContent.en

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-16">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="eyebrow" className="mb-4">
            {isAr ? 'باقة المنتجات' : 'Product Suite'}
          </Badge>
          <h1 className="heading-1 mb-6 text-foreground">
            {isAr
              ? 'منظومة ذكاء متكاملة مصممة للذكاء الاصطناعي الموثوق'
              : 'A complete intelligence stack built for governed AI'}
          </h1>
          <p className="body max-w-2xl text-muted-foreground">
            {isAr
              ? 'كل ما يحتاجه فريقك لتحويل مستودعات البيانات السحابية إلى إجابات حوارية موثوقة وتجارب تفاعلية فائقة السرعة.'
              : 'Everything your team needs to transform raw cloud warehouses into reliable, conversational answers and interactive data experiences.'}
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.slug} className="flex flex-col justify-between p-8 border border-border hover:shadow-xl transition-all">
              <div>
                <div className={`size-12 rounded-2xl bg-gradient-to-br ${product.color} text-white flex items-center justify-center mb-6 shadow-md`}>
                  <product.icon className="size-6" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="heading-3 text-foreground">{product.title}</h3>
                </div>
                <Badge variant="outline" className="text-xs mb-3">{product.badge}</Badge>
                
                <p className="font-semibold text-xs text-foreground mb-2">{product.tagline}</p>
                <p className="caption text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-6 border-t border-border pt-4">
                  <ul className="space-y-2">
                    {product.capabilities.slice(0, 3).map((cap) => (
                      <li key={cap} className="flex items-start gap-2 text-xs text-foreground">
                        <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-2">
                <Button
                  render={<Link href={`/product/${product.slug}`} />}
                  nativeButton={false}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>{isAr ? 'اكتشف المزيد' : 'Learn more'}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </Card>
          ))}

          {/* Platform teaser card */}
          <Card className="flex flex-col justify-between p-8 border-2 border-primary/20 bg-muted/20">
            <div>
              <div className="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6">
                <Sparkles className="size-6" />
              </div>
              <h3 className="heading-3 text-foreground mb-2">
                {isAr ? 'المنصة وذكاء الأعمال الوكيلي' : 'Platform & Agentic BI'}
              </h3>
              <Badge variant="new" className="text-xs mb-3">
                {isAr ? 'المحرك الأساسي' : 'Core Engine'}
              </Badge>
              <p className="caption text-muted-foreground leading-relaxed">
                {isAr
                  ? 'اكتشف المعمارية التقنية التي تدعم me.inc: ذكاء الأعمال المعتمد على الكود والتكامل السلس مع كافة المستودعات.'
                  : 'Discover the underlying engine powering me.inc: autonomous code-first BI and seamless warehouse integrations.'}
              </p>
            </div>
            <div className="mt-8 pt-2">
              <Button render={<Link href="/platform" />} nativeButton={false} variant="default" className="w-full justify-between">
                <span>{isAr ? 'استكشف المنصة' : 'Explore Platform'}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
