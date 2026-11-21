import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { customerStoriesContent, customerStories } from '../page'
import { ArrowLeft, CheckCircle2, Quote } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isAr = locale === 'ar'
  const list = isAr ? customerStoriesContent.ar : customerStoriesContent.en
  const story = list.find((s) => s.slug === slug)
  if (!story) return { title: isAr ? 'قصة نجاح - me.inc' : 'Case Study - me.inc' }
  return {
    title: isAr ? `قصة نجاح ${story.companyName} - me.inc` : `${story.companyName} Case Study - me.inc`,
    description: story.summary,
  }
}

export function generateStaticParams() {
  return customerStories.map((s) => ({ slug: s.slug }))
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const list = isAr ? customerStoriesContent.ar : customerStoriesContent.en

  const story = list.find((s) => s.slug === slug)
  if (!story) notFound()

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-12">
        {/* Back navigation */}
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground no-underline font-medium transition-colors"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {isAr ? 'العودة إلى جميع قصص النجاح' : 'Back to all customer stories'}
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl font-black text-foreground">
              {story.logo}
            </span>
            <span className="text-muted-foreground">/</span>
            <Badge variant="outline">{story.industry}</Badge>
          </div>

          <h1 className="heading-1 text-foreground max-w-4xl">
            {story.title}
          </h1>

          <p className="body text-muted-foreground max-w-3xl">
            {story.summary}
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-3xl bg-muted/30 p-8 border border-border">
          {story.stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-start">
              <span className="heading-1 font-extrabold text-primary">{stat.value}</span>
              <p className="caption mt-1 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Detailed Case Study Content */}
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="heading-2 mb-4 text-foreground">
                {isAr ? 'التحدي والمشكلة' : 'The Challenge'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? `مع وتيرة النمو السريعة لـ ${story.companyName}، احتاجت فرق العمل في المنتجات والمالية والعمليات إلى إجابات مستمرة لاستفسارات البيانات تفوق قدرة فريق هندسة البيانات. وكانت لوحات التحكم التقليدية جامدة وتتطلب تعديل استعلامات SQL يدوياً بشكل متكرر، مما راكم طوابير انتظار استمرت لأسابيع.`
                  : `As ${story.companyName} experienced rapid adoption, business stakeholders across product, finance, and operations required answers to data queries that outpaced the engineering team's bandwidth. Traditional dashboard tools were rigid, required constant SQL updates, and created query queues stretching several weeks.`}
              </p>
            </div>

            <div>
              <h2 className="heading-2 mb-4 text-foreground">
                {isAr ? 'الحل مع me.inc' : 'The Solution with me.inc'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {isAr
                  ? `باعتماد ذكاء الأعمال الوكيلي ودليل المقاييس من me.inc، أسست ${story.companyName} طبقة دلالية موحدة تربط مستودع بياناتها السحابي مباشرة بواجهات المحادثة الذكية.`
                  : `By implementing me.inc's Agentic BI and Metrics Catalog, ${story.companyName} established a unified semantic layer connecting their cloud warehouse directly to conversational interfaces.`}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'مؤشرات أداء محددة بالكود البرمجي مع حفظ الإصدارات ومزامنتها في كل مكان.'
                      : 'Version-controlled KPIs defined once in code and synced everywhere.'}
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'استعلامات ذكاء اصطناعي باللغة الطبيعية مع توليد استعلامات SQL مدققة وخالية من الهلوسة.'
                      : 'Natural language AI queries with verifiable SQL generation.'}
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'بنية تنعدم فيها تخزين البيانات الخام لضمان أقصى درجات الخصوصية والامتثال.'
                      : 'Zero raw row data storage ensuring strict privacy and regulatory compliance.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Testimonial Quote */}
            <Card className="p-8 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary bg-card border-border">
              <Quote className="size-8 text-primary mb-4 opacity-70" />
              <blockquote className="font-heading text-lg font-medium text-foreground italic leading-relaxed">
                "{story.quote}"
              </blockquote>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-bold text-sm text-foreground">{story.author}</p>
                <p className="text-xs text-muted-foreground">{story.companyName}</p>
              </div>
            </Card>

            <div>
              <h2 className="heading-2 mb-4 text-foreground">
                {isAr ? 'الأثر والنتائج على الأعمال' : 'The Business Impact'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? `اليوم، يتم الرد على أكثر من 90% من استفسارات البيانات في ${story.companyName} لحظياً عبر me.inc دون تدخل بشري من مهندسي البيانات. والقرارات التي كانت تنتظر أياماً تُتخذ الآن في دقائق.`
                  : `Today, more than 90% of internal data questions at ${story.companyName} are answered instantly via me.inc without human engineering intervention. Decisions that previously waited on weekly analyst reviews now happen within minutes.`}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 border border-border">
              <h4 className="font-heading font-semibold text-foreground mb-4">
                {isAr ? 'نظرة عامة على الشركة' : 'Company Overview'}
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">{isAr ? 'الشركة' : 'Company'}</span>
                  <span className="font-semibold text-foreground">{story.companyName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{isAr ? 'القطاع' : 'Industry'}</span>
                  <span className="font-semibold text-foreground">{story.industry}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{isAr ? 'المنتجات المستخدمة' : 'Products Used'}</span>
                  <span className="font-semibold text-foreground">
                    {isAr
                      ? 'ذكاء الأعمال الوكيلي، دليل المقاييس، التحليلات الحوارية'
                      : 'Agentic BI, Metrics Catalog, Conversational AI'}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Button render={<Link href="/demo" />} nativeButton={false} className="w-full justify-center">
                  {isAr ? 'جرّب me.inc مع فريقك' : 'Try me.inc for your team'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-muted/20">
              <h4 className="font-heading font-semibold text-foreground mb-2">
                {isAr ? 'استكشف قصص نجاح أخرى' : 'Explore other stories'}
              </h4>
              <div className="space-y-3">
                {list
                  .filter((s) => s.slug !== story.slug)
                  .map((other) => (
                    <Link
                      key={other.slug}
                      href={`/customers/${other.slug}`}
                      className="block text-xs font-medium text-foreground hover:text-primary no-underline transition-colors"
                    >
                      → {other.companyName}: {other.title.slice(0, 45)}...
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  )
}
