import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { productsContent, productList } from '../page'
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Zap, Database } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isAr = locale === 'ar'
  const list = isAr ? productsContent.ar : productsContent.en
  const product = list.find((p) => p.slug === slug)
  if (!product) return { title: isAr ? 'المنتجات - me.inc' : 'Product - me.inc' }
  return {
    title: `${product.title} - me.inc`,
    description: product.description,
  }
}

export function generateStaticParams() {
  return productList.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const list = isAr ? productsContent.ar : productsContent.en

  const product = list.find((p) => p.slug === slug)
  if (!product) notFound()

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-16">
        {/* Back navigation */}
        <div>
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground no-underline font-medium transition-colors"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {isAr ? 'العودة لجميع المنتجات' : 'All Products'}
          </Link>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className={`size-16 rounded-3xl bg-gradient-to-br ${product.color} text-white flex items-center justify-center mb-6 shadow-xl`}>
            <product.icon className="size-8" />
          </div>
          <Badge variant="new" className="mb-4">
            {product.badge}
          </Badge>
          <h1 className="heading-1 text-foreground mb-4">
            {product.title}
          </h1>
          <p className="font-heading text-xl text-primary font-semibold mb-4">
            {product.tagline}
          </p>
          <p className="body text-muted-foreground max-w-2xl mb-8">
            {product.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button render={<Link href="/demo" />} nativeButton={false} size="lg" variant="default">
              {isAr ? 'تجربة تفاعلية مباشرة' : 'Try Interactive Demo'} <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
            <Button render={<Link href="/pricing" />} nativeButton={false} size="lg" variant="outline">
              {isAr ? 'عرض باقات الأسعار' : 'View Pricing'}
            </Button>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div>
          <div className="text-center mb-10">
            <h2 className="heading-2 text-foreground">
              {isAr ? 'القدرات والمميزات الأساسية' : 'Core Capabilities'}
            </h2>
            <p className="caption mt-2 text-muted-foreground">
              {isAr
                ? 'مصممة خصيصاً للمؤسسات: موثوقية تشغيلية، ودقة خاضعة للحوكمة، وقابلية توسع هائلة.'
                : 'Engineered for production reliability, governed accuracy, and scale.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {product.capabilities.map((cap, idx) => (
              <Card key={idx} className="p-6 border border-border flex items-start gap-4">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-base mb-1">{cap}</h4>
                  <p className="caption text-muted-foreground">
                    {isAr
                      ? 'مؤتمتة بالكامل مع سجلات تدقيق مؤسسية، وصلاحيات مبنية على الأدوار، وتنفيذ في أجزاء من الثانية.'
                      : 'Fully automated with enterprise auditing, role-based controls, and sub-second execution.'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Architecture & Security Highlights */}
        <div className="rounded-3xl bg-muted/30 p-8 sm:p-12 border border-border">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <Shield className="size-8 text-primary" />
              <h4 className="font-heading font-bold text-foreground">
                {isAr ? 'استعلام دون تخزين للبيانات' : 'Zero-Storage Querying'}
              </h4>
              <p className="caption text-muted-foreground">
                {isAr
                  ? 'سجلات قواعد البيانات الخام تبقى بأمان داخل مستودعك الخاص. تتم معالجة البيانات الوصفية والإحصاءات التجميعية فقط.'
                  : 'Raw database records remain securely inside your warehouse. Only metadata and query aggregates are processed.'}
              </p>
            </div>
            <div className="space-y-2">
              <Zap className="size-8 text-primary" />
              <h4 className="font-heading font-bold text-foreground">
                {isAr ? 'تخزين دلالي فوري' : 'Sub-Second Caching'}
              </h4>
              <p className="caption text-muted-foreground">
                {isAr
                  ? 'يقلل التخزين المؤقت الدلالي من تكاليف استهلاك المستودع السحابي ويسرع الإجابات الشائعة لتصل إلى بضع أجزاء من الثانية.'
                  : 'Semantic caching reduces warehouse query costs and accelerates common analytics requests down to milliseconds.'}
              </p>
            </div>
            <div className="space-y-2">
              <Database className="size-8 text-primary" />
              <h4 className="font-heading font-bold text-foreground">
                {isAr ? 'مزامنة ثنائية الاتجاه مع Git' : 'Bi-directional Git Sync'}
              </h4>
              <p className="caption text-muted-foreground">
                {isAr
                  ? 'إدارة الأبعاد والقياسات والحقول المحسوبة بدقة عبر دورة مراجعة الكود البرمجي وحفظ الإصدارات.'
                  : 'Manage dimensions, measures, and calculated fields using version-controlled code reviews.'}
              </p>
            </div>
          </div>
        </div>

        {/* Other Products Carousel / Row */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-3 text-foreground">
              {isAr ? 'استكشف مزايا ومنتجات أخرى' : 'Explore more features'}
            </h3>
            <Link href="/product" className="text-xs font-semibold text-primary hover:underline">
              {isAr ? 'عرض جميع المنتجات ←' : 'View all products →'}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/product/${other.slug}`}
                  className="rounded-2xl border border-border bg-card p-5 no-underline hover:border-primary/50 transition-colors"
                >
                  <p className="font-heading text-sm font-bold text-foreground">{other.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{other.tagline}</p>
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
