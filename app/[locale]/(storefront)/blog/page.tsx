import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'المدونة الهندسية (Lightning Posts) - me.inc' : 'Blog (Lightning Posts) - me.inc',
    description: isAr
      ? 'مقالات هندسية متعمقة حول الذكاء الاصطناعي للبيانات، والطبقات الدلالية، وذكاء الأعمال الوكيلي.'
      : 'Deep dives on generative AI for data, modern semantic layers, and agentic business intelligence.',
  }
}

interface Article {
  slug: string
  title: string
  category: string
  readTime: string
  date: string
  excerpt: string
  featured: boolean
}

const blogContent = {
  en: {
    eyebrow: 'Lightning Posts',
    heading: 'Engineering thoughts & modern data perspectives',
    subheading: 'Explorations into autonomous analytics, semantic layer design, database performance, and the future of business intelligence.',
    authorTeam: 'me.inc Research Team',
    authorRole: 'Core Architecture & AI',
    readArticle: 'Read Article',
    readMore: 'Read more',
    subscribeTitle: 'Subscribe to Lightning Posts',
    subscribeSubtitle: 'Get notified when we publish new architectural deep dives, benchmarks, and data engineering case studies.',
    emailPlaceholder: 'Enter your email',
    subscribeButton: 'Subscribe',
    articles: [
      {
        slug: 'death-of-the-dashboard-backlog',
        title: 'The Death of the Dashboard Backlog: Why AI Agents Are Replacing Static Reports',
        category: 'Architecture',
        readTime: '6 min read',
        date: 'Nov 18, 2026',
        excerpt: 'How leading data teams are shifting from building rigid, one-off reporting dashboards to defining governed semantic contracts for autonomous agents.',
        featured: true,
      },
      {
        slug: 'preventing-llm-hallucinations-in-sql',
        title: 'Preventing LLM Hallucinations in Enterprise SQL Generation',
        category: 'Engineering',
        readTime: '8 min read',
        date: 'Nov 10, 2026',
        excerpt: 'Why generic LLMs fail at complex analytical joins, and how deterministic semantic graphs enforce 100% mathematical accuracy.',
        featured: false,
      },
      {
        slug: 'zero-storage-bi-architecture',
        title: 'Zero-Storage Analytics: How to Query Cloud Warehouses Without Moving Data',
        category: 'Security',
        readTime: '5 min read',
        date: 'Oct 29, 2026',
        excerpt: 'An inside look at our security architecture: push-down query compilation, encrypted metadata synchronization, and strict zero-row storage.',
        featured: false,
      },
      {
        slug: 'scaling-metrics-with-git',
        title: 'GitOps for KPIs: Version Controlling Your Business Logic',
        category: 'Best Practices',
        readTime: '7 min read',
        date: 'Oct 14, 2026',
        excerpt: 'Treating metric formulas like production code with automated pull request reviews, schema migration tests, and instant rollback.',
        featured: false,
      },
    ] as Article[],
  },
  ar: {
    eyebrow: 'المدونة الهندسية (Lightning Posts)',
    heading: 'رؤى هندسية وأفكار تقنية حول مستقبل البيانات',
    subheading: 'مقالات متعمقة في التحليلات المستقلة، وتصميم الطبقات الدلالية، وأداء قواعد البيانات، والجيل القادم من ذكاء الأعمال.',
    authorTeam: 'فريق أبحاث me.inc',
    authorRole: 'المعمارية الأساسية والذكاء الاصطناعي',
    readArticle: 'قراءة المقال',
    readMore: 'قراءة المزيد',
    subscribeTitle: 'اشترك في المدونة الهندسية',
    subscribeSubtitle: 'احصل على إشعار عند نشر مقالات هندسية متعمقة ومقارنات معيارية ودراسات حالة جديدة.',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    subscribeButton: 'اشتراك',
    articles: [
      {
        slug: 'death-of-the-dashboard-backlog',
        title: 'نهاية طوابير طلبات لوحات التحكم: لماذا يحل وكلاء الذكاء الاصطناعي محل التقارير الجامدة',
        category: 'معمارية النظم',
        readTime: '6 دقائق قراءة',
        date: '18 نوفمبر 2026',
        excerpt: 'كيف تتحول فرق البيانات الرائدة من بناء لوحات تحكم جامدة إلى وضع عقود دلالية معتمدة للوكلاء الأذكياء.',
        featured: true,
      },
      {
        slug: 'preventing-llm-hallucinations-in-sql',
        title: 'منع هلوسة نماذج اللغة الكبيرة في توليد استعلامات SQL للمؤسسات',
        category: 'هندسة البرمجيات',
        readTime: '8 دقائق قراءة',
        date: '10 نوفمبر 2026',
        excerpt: 'لماذا تفشل النماذج العامة في عمليات الربط المعقدة، وكيف تضمن المخططات الدلالية دقة رياضية بنسبة 100%.',
        featured: false,
      },
      {
        slug: 'zero-storage-bi-architecture',
        title: 'التحليلات دون تخزين: كيف تستعلم مستودعات البيانات السحابية دون نقل صف واحد',
        category: 'الأمان والخصوصية',
        readTime: '5 دقائق قراءة',
        date: '29 أكتوبر 2026',
        excerpt: 'نظرة داخلية على بنيتنا الأمنية: ترحيل الاستعلامات للمستودع، وتشفير البيانات الوصفية، والامتناع التام عن تخزين البيانات الخام.',
        featured: false,
      },
      {
        slug: 'scaling-metrics-with-git',
        title: 'إدارة مؤشرات الأداء عبر Git: حفظ إصدارات منطق الأعمال بالكود',
        category: 'أفضل الممارسات',
        readTime: '7 دقائق قراءة',
        date: '14 أكتوبر 2026',
        excerpt: 'التعامل مع معادلات المقاييس ككود برمجي إنتاجي مع مراجعات طلبات السحب (PRs)، واختبارات التوافق التلقائية.',
        featured: false,
      },
    ] as Article[],
  },
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? blogContent.ar : blogContent.en

  const featured = t.articles.find((a) => a.featured)
  const regular = t.articles.filter((a) => !a.featured)

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

        {/* Featured Post */}
        {featured && (
          <Card className="p-8 sm:p-10 border border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="new">{featured.category}</Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> {featured.readTime}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{featured.date}</span>
            </div>

            <h2 className="heading-2 text-foreground mb-4 max-w-3xl">
              {featured.title}
            </h2>
            <p className="body text-muted-foreground max-w-2xl mb-8">
              {featured.excerpt}
            </p>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  ME
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.authorTeam}</p>
                  <p className="text-[11px] text-muted-foreground">{t.authorRole}</p>
                </div>
              </div>
              <Button size="sm">
                {t.readArticle} <ArrowRight className="size-3.5 rtl:rotate-180" />
              </Button>
            </div>
          </Card>
        )}

        {/* Post Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {regular.map((post) => (
            <Card key={post.slug} className="p-6 border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="heading-4 text-foreground mb-3 leading-snug">
                  {post.title}
                </h3>
                <p className="caption text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="font-semibold text-primary inline-flex items-center gap-1">
                  {t.readMore} <ArrowRight className="size-3 rtl:rotate-180" />
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="rounded-3xl bg-surface-contrast text-foreground p-10 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="heading-3 mb-2">{t.subscribeTitle}</h3>
            <p className="caption text-muted-foreground">
              {t.subscribeSubtitle}
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
            />
            <Button size="sm" className="shrink-0">
              {t.subscribeButton}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
