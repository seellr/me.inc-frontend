import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'قصص نجاح العملاء - me.inc' : 'Customer Stories - me.inc',
    description: isAr
      ? 'اكتشف كيف تتوسع أفضل فرق البيانات والهندسة العالمية بسرعة وثقة عبر منصة me.inc.'
      : 'Discover how modern engineering and data teams scale faster with me.inc.',
  }
}

export interface CustomerStoryData {
  slug: string
  logo: string
  companyName: string
  industry: string
  title: string
  summary: string
  stats: { label: string; value: string }[]
  quote: string
  author: string
}

export const customerStoriesContent: Record<'en' | 'ar', CustomerStoryData[]> = {
  en: [
    {
      slug: 'fal',
      logo: 'fal',
      companyName: 'fal.ai',
      industry: 'Generative AI Infrastructure',
      title: 'How fal uses Agentic BI to run data for 80 people with a team of one',
      summary: 'With thousands of GPU compute queries spinning per second, fal empowered every product manager and engineer to self-serve metrics without backlog queues.',
      stats: [
        { label: 'Time saved weekly', value: '25+ hrs' },
        { label: 'Ad-hoc ticket drop', value: '-85%' },
        { label: 'Self-serve adoption', value: '94%' },
      ],
      quote: 'me.inc completely eliminated our data bottlenecks. One data engineer now supports our entire 80-person company seamlessly.',
      author: 'Burkay Gur, Co-Founder at fal.ai',
    },
    {
      slug: 'gen-h',
      logo: 'Gen H',
      companyName: 'Gen H Fintech',
      industry: 'Proptech & Mortgage Lending',
      title: "How Gen H's CCO shipped production metrics in two days using Agentic BI",
      summary: 'Navigating stringent financial compliance and real-time loan underwriting KPIs, Gen H went from spreadsheets to governed AI analytics in 48 hours.',
      stats: [
        { label: 'Time to production', value: '2 Days' },
        { label: 'Report generation', value: 'Real-time' },
        { label: 'Audit compliance', value: '100%' },
      ],
      quote: 'We avoided hiring two additional analytics engineers. The semantic catalog gave us immediate confidence in our numbers.',
      author: 'Chief Commercial Officer, Gen H',
    },
    {
      slug: 'justwatch',
      logo: 'JustWatch',
      companyName: 'JustWatch International',
      industry: 'Streaming & Media Discovery',
      title: 'How JustWatch built an AI-powered data culture across 40+ markets',
      summary: 'Serving over 40 million monthly active movie lovers, JustWatch enabled regional marketing managers to query retention patterns using conversational natural language.',
      stats: [
        { label: 'Monthly active users', value: '40M+' },
        { label: 'Markets analyzed', value: '40+' },
        { label: 'Daily AI queries', value: '1,200+' },
      ],
      quote: 'Every market lead can query data like a senior analyst. Our decision velocity has tripled since adopting me.inc.',
      author: 'Head of Growth, JustWatch',
    },
  ],
  ar: [
    {
      slug: 'fal',
      logo: 'fal',
      companyName: 'fal.ai',
      industry: 'بنية الذكاء الاصطناعي التوليدي',
      title: 'كيف تدير fal بيانات 80 موظفاً عبر ذكاء الأعمال الوكيلي بفريق من شخص واحد',
      summary: 'مع آلاف عمليات الحوسبة عبر معالجات GPU كل ثانية، مكنت fal كل مدير منتج ومهندس من استخراج المؤشرات ذاتياً دون انتظار طوابير التحليل.',
      stats: [
        { label: 'وقت موفر أسبوعياً', value: '25+ ساعة' },
        { label: 'انخفاض طلبات البيانات', value: '-85%' },
        { label: 'نسبة الاعتماد الذاتي', value: '94%' },
      ],
      quote: 'قضت منصة me.inc تماماً على اختناقات البيانات لدينا. مهندس بيانات واحد الآن يدعم شركتنا بالكامل المكونة من 80 شخصاً بسلاسة تامة.',
      author: 'بوركاي جور، الشريك المؤسس في fal.ai',
    },
    {
      slug: 'gen-h',
      logo: 'Gen H',
      companyName: 'Gen H التقنية المالية',
      industry: 'التقنية العقارية والتمويل السكني',
      title: 'كيف أطلق CCO في Gen H مقاييس الإنتاج في يومين فقط عبر ذكاء الأعمال الوكيلي',
      summary: 'في ظل معايير الامتثال المالي الدقيقة ومؤشرات التمويل اللحظية، انتقلت Gen H من الجداول اليدوية إلى التحليلات المؤتمتة خلال 48 ساعة فقط.',
      stats: [
        { label: 'الوصول للإنتاج', value: 'يومان فقط' },
        { label: 'توليد التقارير', value: 'لحظي ومباشر' },
        { label: 'الامتثال للتدقيق', value: '100%' },
      ],
      quote: 'وفرنا توظيف مهندسي تحليلات إضافيين. لقد منحنا دليل المقاييس الدلالي ثقة فورية مطلقة في أرقامنا.',
      author: 'المدير التجاري التنفيذي، Gen H',
    },
    {
      slug: 'justwatch',
      logo: 'JustWatch',
      companyName: 'JustWatch العالمية',
      industry: 'البث واكتشاف الوسائط',
      title: 'كيف بنت JustWatch ثقافة بيانات مدعومة بالذكاء الاصطناعي في أكثر من 40 سوقاً',
      summary: 'بخدمة أكثر من 40 مليون مستخدم نشط شهرياً، مكنت JustWatch مديري التسويق الإقليميين من استعلام أنماط بقاء المستخدمين باستخدام لغة طبيعية حوارية.',
      stats: [
        { label: 'مستخدم نشط شهرياً', value: '40M+' },
        { label: 'أسواق تم تحليلها', value: '40+' },
        { label: 'استعلام ذكي يومياً', value: '1,200+' },
      ],
      quote: 'بات بإمكان كل قائد سوق استخراج البيانات ككبير محللين. لقد تضاعفت سرعة اتخاذ قراراتنا ثلاثة أضعاف منذ اعتمادنا على me.inc.',
      author: 'رئيس قسم النمو، JustWatch',
    },
  ],
}

export const customerStories = customerStoriesContent.en

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const stories = isAr ? customerStoriesContent.ar : customerStoriesContent.en

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-16">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="eyebrow" className="mb-4">
            {isAr ? 'قصص نجاح العملاء' : 'Customer Stories'}
          </Badge>
          <h1 className="heading-1 mb-6 text-foreground">
            {isAr ? 'موثوق من أسرع فرق البيانات نمواً حول العالم' : 'Loved by fast-moving data teams everywhere'}
          </h1>
          <p className="body max-w-2xl text-muted-foreground">
            {isAr
              ? 'تعرف على كيفية استبدال الشركات الرائدة لطوابير استعلامات البيانات بالذكاء الفوري المعتمد عبر منصة me.inc.'
              : 'Learn how leading startups and enterprise leaders use me.inc to replace query queues with instant, governed AI intelligence.'}
          </p>
        </div>

        {/* High-level metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <span className="heading-1 font-extrabold text-primary">10x</span>
            <p className="caption mt-1 text-muted-foreground">{isAr ? 'رؤى تحليلية أسرع' : 'Faster query insights'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <span className="heading-1 font-extrabold text-foreground">85%</span>
            <p className="caption mt-1 text-muted-foreground">{isAr ? 'انخفاض في تذاكر الاستفسارات' : 'Drop in ad-hoc tickets'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <span className="heading-1 font-extrabold text-foreground">50M+</span>
            <p className="caption mt-1 text-muted-foreground">{isAr ? 'استعلام دلالي منجز' : 'Semantic queries run'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <span className="heading-1 font-extrabold text-foreground">99.9%</span>
            <p className="caption mt-1 text-muted-foreground">{isAr ? 'دقة وتناسق في المؤشرات' : 'Metric consistency'}</p>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.slug} className="flex flex-col justify-between p-8 border border-border transition-all hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="font-heading text-lg font-bold text-foreground">
                    {story.companyName}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {story.industry}
                  </Badge>
                </div>

                <div className="mt-6 aspect-video w-full rounded-2xl bg-muted/60 flex items-center justify-center border border-border">
                  <span className="font-heading text-2xl font-black text-muted-foreground/60 tracking-wider">
                    {story.logo}
                  </span>
                </div>

                <h3 className="heading-3 mt-6 text-foreground leading-snug">
                  {story.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {story.summary}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2 border-y border-border py-4">
                  {story.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-heading text-base font-bold text-foreground">{stat.value}</p>
                      <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-2">
                <Button
                  render={<Link href={`/customers/${story.slug}`} />}
                  nativeButton={false}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>{isAr ? 'قراءة قصة النجاح كاملة' : 'Read full case study'}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-3xl bg-surface-contrast text-foreground p-10 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="heading-3 mb-2">
              {isAr ? 'هل أنت مستعد لتطوير ثقافة البيانات في شركتك؟' : 'Ready to transform your company data culture?'}
            </h3>
            <p className="caption text-muted-foreground">
              {isAr
                ? 'ابدأ في أقل من 5 دقائق مع باقتنا المجانية أو تواصل مع فريقنا الاستشاري.'
                : 'Get started in under 5 minutes with our zero-risk starter plan or talk with our team.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button render={<Link href="/demo" />} nativeButton={false} variant="default" size="lg">
              {isAr ? 'طلب عرض توضيحي' : 'Request a Demo'}
            </Button>
            <Button render={<Link href="/pricing" />} nativeButton={false} variant="outline" size="lg">
              {isAr ? 'عرض باقات الأسعار' : 'View Pricing'}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
