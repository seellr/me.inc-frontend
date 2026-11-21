import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'خارطة طريق المنتج - me.inc' : 'Product Roadmap - me.inc',
    description: isAr
      ? 'شاهد ما نبنيه الآن، واستكشف المزايا القادمة، وشارك بالتصويت على مقترحات التطوير القادمة.'
      : 'See what we are building, explore upcoming features, and vote on future releases.',
  }
}

interface RoadmapItem {
  title: string
  description: string
  tag: string
  votes: number
}

const roadmapContent = {
  en: {
    eyebrow: 'Product Roadmap',
    heading: 'Building the next generation of BI, in public',
    subheading: 'Take a look at what we’ve recently shipped, what our engineers are working on right now, and what’s coming down the pipeline.',
    colShipped: 'Recently Shipped',
    colInProgress: 'In Progress',
    colPlanned: 'Planned Next',
    tagShipped: 'Shipped',
    ctaTitle: 'Have an idea or feature request?',
    ctaSubtitle: 'Our product engineers review community proposals weekly. Suggest a database connector, agent capability, or UX workflow you need.',
    ctaButton: 'Submit Feature Request on Community',
    shipped: [
      {
        title: 'Snowflake Native App',
        description: 'Run me.inc agents directly inside your Snowflake data cloud compute perimeter.',
        tag: 'Platform',
        votes: 342,
      },
      {
        title: 'Multi-Language Querying (Arabic & English)',
        description: 'Full RTL support and localized natural language semantic comprehension.',
        tag: 'AI',
        votes: 289,
      },
      {
        title: 'Instant SVG & Figma Exports',
        description: 'Export charts directly into vector formats or live Figma components.',
        tag: 'UX',
        votes: 195,
      },
    ] as RoadmapItem[],
    inProgress: [
      {
        title: 'Multi-Agent Query Decomposition',
        description: 'Break complex executive questions into parallel analytical tasks across multiple databases.',
        tag: 'Core Engine',
        votes: 512,
      },
      {
        title: 'dbt Cloud Bidirectional Sync',
        description: 'Automatically pull metric definitions from dbt docs and update models via PRs.',
        tag: 'Integration',
        votes: 420,
      },
      {
        title: 'Automated Anomaly Attribution',
        description: 'AI agents detect metric spikes and automatically diagnose underlying drivers.',
        tag: 'Analytics',
        votes: 388,
      },
    ] as RoadmapItem[],
    planned: [
      {
        title: 'Self-Healing Data Pipelines',
        description: 'When database schemas change upstream, agents suggest and validate the needed code diffs.',
        tag: 'Agentic BI',
        votes: 670,
      },
      {
        title: 'Local LLM Deployment (Ollama / vLLM)',
        description: 'Zero external cloud API dependencies for air-gapped sovereign installations.',
        tag: 'Security',
        votes: 485,
      },
      {
        title: 'Voice-Activated Mobile Companion',
        description: 'Ask for KPI summaries on iOS and Android while on the go.',
        tag: 'Mobile',
        votes: 310,
      },
    ] as RoadmapItem[],
  },
  ar: {
    eyebrow: 'خارطة طريق المنتج',
    heading: 'نبني الجيل القادم من ذكاء الأعمال، بشفافية وأمام الجميع',
    subheading: 'ألقِ نظرة على ما أطلقناه حديثاً، وما يعمل مهندسونا على تطويره الآن، وما نخطط لإطلاقه في المراحل القادمة.',
    colShipped: 'تم إطلاقه مؤخراً',
    colInProgress: 'قيد التطوير حالياً',
    colPlanned: 'المخطط له لاحقاً',
    tagShipped: 'مكتمل ومتاح',
    ctaTitle: 'هل لديك فكرة أو اقتراح لميزة جديدة؟',
    ctaSubtitle: 'يراجع مهندسو المنتجات مقترحات المجتمع أسبوعياً. اقترح موصل قاعدة بيانات، أو قدرة جديدة للوكيل، أو تحسيناً في تجربة الاستخدام.',
    ctaButton: 'تقديم مقترح في مجتمعنا',
    shipped: [
      {
        title: 'تطبيق أصيل لـ Snowflake (Native App)',
        description: 'تشغيل وكلاء me.inc مباشرة داخل النطاق الحوسبي السحابي لـ Snowflake.',
        tag: 'المنصة',
        votes: 342,
      },
      {
        title: 'استعلامات ثنائية اللغة (العربية والإنجليزية)',
        description: 'دعم كامل للكتابة من اليمين لليسار (RTL) واستيعاب المعاني الدلالية باللغة العربية.',
        tag: 'الذكاء الاصطناعي',
        votes: 289,
      },
      {
        title: 'تصدير فوري إلى SVG و Figma',
        description: 'تصدير الرسوم البيانية كمتجهات أو كمكونات حية مباشرة إلى ملفات Figma.',
        tag: 'تجربة المستخدم',
        votes: 195,
      },
    ] as RoadmapItem[],
    inProgress: [
      {
        title: 'تفكيك الاستعلامات عبر وكلاء متعددين',
        description: 'تجزئة الأسئلة التنفيذية المعقدة إلى مهام تحليلية متوازية عبر عدة قواعد بيانات.',
        tag: 'المحرك الأساسي',
        votes: 512,
      },
      {
        title: 'مزامنة ثنائية الاتجاه مع dbt Cloud',
        description: 'استيراد تعريفات المقاييس من dbt وتحديث النماذج تلقائياً عبر طلبات سحب (PRs).',
        tag: 'التكامل',
        votes: 420,
      },
      {
        title: 'التشخيص التلقائي لحالات الشذوذ في البيانات',
        description: 'يكتشف الوكلاء الذكيون التغيرات المفاجئة في المؤشرات ويحددون أسبابها الجذرية تلقائياً.',
        tag: 'التحليلات',
        votes: 388,
      },
    ] as RoadmapItem[],
    planned: [
      {
        title: 'مسارات بيانات ذاتية الإصلاح والتصحيح',
        description: 'عند تعديل هيكل قاعدة البيانات بالمنبع، يقترح الوكلاء التعديلات البرمجية ويتحققون منها.',
        tag: 'ذكاء الأعمال الوكيلي',
        votes: 670,
      },
      {
        title: 'تشغيل نماذج الذكاء الاصطناعي محلياً (Ollama / vLLM)',
        description: 'بدون أي اعتمادية على واجهات سحابية خارجية للبيئات المؤسسية المعزولة تماماً.',
        tag: 'الأمان والسيادة',
        votes: 485,
      },
      {
        title: 'تطبيق الهاتف الذكي الموجه صوتياً',
        description: 'استفسر عن مؤشرات أدائك وتلخيصات البيانات بصوتك عبر iOS و Android أثناء تنقلك.',
        tag: 'تطبيقات الهاتف',
        votes: 310,
      },
    ] as RoadmapItem[],
  },
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? roadmapContent.ar : roadmapContent.en

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

        {/* Roadmap Columns */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipped */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <h3 className="heading-4 text-foreground">{t.colShipped}</h3>
              <Badge variant="outline" className="ms-auto text-xs">{t.shipped.length}</Badge>
            </div>
            <div className="space-y-4">
              {t.shipped.map((item) => (
                <Card key={item.title} className="p-5 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px]">{item.tag}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> {t.tagShipped}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="caption text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="size-2.5 rounded-full bg-primary animate-pulse" />
              <h3 className="heading-4 text-foreground">{t.colInProgress}</h3>
              <Badge variant="new" className="ms-auto text-xs">{t.inProgress.length}</Badge>
            </div>
            <div className="space-y-4">
              {t.inProgress.map((item) => (
                <Card key={item.title} className="p-5 border-2 border-primary/20 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="new" className="text-[10px]">{item.tag}</Badge>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                      <ThumbsUp className="size-3.5" /> {item.votes}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="caption text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Planned */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="size-2.5 rounded-full bg-amber" />
              <h3 className="heading-4 text-foreground">{t.colPlanned}</h3>
              <Badge variant="outline" className="ms-auto text-xs">{t.planned.length}</Badge>
            </div>
            <div className="space-y-4">
              {t.planned.map((item) => (
                <Card key={item.title} className="p-5 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px]">{item.tag}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3.5" /> {item.votes}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="caption text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Suggest Feature Card */}
        <Card className="rounded-3xl bg-muted/40 p-8 border border-border text-center flex flex-col items-center">
          <Sparkles className="size-8 text-primary mb-3" />
          <h3 className="heading-3 text-foreground mb-2">{t.ctaTitle}</h3>
          <p className="caption max-w-lg text-muted-foreground mb-6">
            {t.ctaSubtitle}
          </p>
          <Button render={<Link href="/community" />} nativeButton={false} variant="default">
            {t.ctaButton} <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        </Card>
      </Container>
    </Section>
  )
}
