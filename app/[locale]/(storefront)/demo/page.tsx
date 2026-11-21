import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Play, Sparkles, Database, CheckCircle2, Bot, ArrowRight, MessageSquare } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'تجربة حية تفاعلية - me.inc' : 'Try Live Demo - me.inc',
    description: isAr
      ? 'اختبر التحليلات الحوارية وذكاء الأعمال الوكيلي لمنصة me.inc مباشرة في متصفحك.'
      : 'Experience me.inc conversational analytics and agentic BI directly in your browser.',
  }
}

const demoContent = {
  en: {
    eyebrow: 'Interactive Experience',
    heading: 'Experience me.inc in action',
    subheading: 'See how business teams ask complex analytical questions in plain English and receive instant, verifiable SQL and interactive visual charts.',
    badgeSandbox: 'Live Sandbox (E-Commerce Store Data)',
    userPrompt: 'What was our highest grossing product category last month, and how does the refund rate compare to industry benchmarks?',
    engineLabel: 'me.inc Agentic Engine',
    engineLatency: 'Generated in 410ms',
    agentAnswer: 'Last month, Digital Software & Tools led revenue at $284,500 (+18.4% MoM). The refund rate for this category was 1.2%, well below the SaaS retail average benchmark of 4.8%.',
    chartTitle: 'Revenue by Category (Oct 2026)',
    verifiedBadge: 'Verified by Metrics Catalog',
    placeholderInput: 'Compare conversion rates across marketing channels this quarter',
    ctaLaunchSandbox: 'Launch Full Free Sandbox',
    guidedTourBadge: 'Personalized Guided Tour',
    guidedTourTitle: 'Schedule a 1-on-1 architecture review',
    guidedTourSubtitle: 'Connect with our staff data architects to test me.inc on your data schemas, review security compliance, and see custom semantic modeling live.',
    benefits: [
      '30-minute tailored walkthrough using your data warehouse type',
      'Technical Q&A on zero-storage architecture, VPC setup, and RBAC',
      'Complimentary proof-of-concept deployment with your team',
    ],
    formTitle: 'Book Your Session',
    formSubtitle: 'Fill in your details and a solutions engineer will get in touch today.',
    formEmail: 'Work Email',
    formFirstName: 'First Name',
    formLastName: 'Last Name',
    formWarehouse: 'Primary Data Warehouse',
    formSubmit: 'Schedule Live Demo',
  },
  ar: {
    eyebrow: 'تجربة تفاعلية مباشرة',
    heading: 'اختبر منصة me.inc على أرض الواقع',
    subheading: 'شاهد كيف تطرح فرق العمل الأسئلة التحليلية المعقدة باللغة الطبيعية وتحصل فوراً على استعلامات SQL مؤكدة ورسوم بيانية تفاعلية.',
    badgeSandbox: 'بيئة تجريبية حية (بيانات متجر إلكتروني)',
    userPrompt: 'ما هو أعلى تصنيف منتجات تحقيقاً للأرباح الشهر الماضي، وكيف يقارن معدل الإرجاع بالمعايير القياسية؟',
    engineLabel: 'محرك الوكلاء في me.inc',
    engineLatency: 'تم التوليد في 410 مللي ثانية',
    agentAnswer: 'في الشهر الماضي، تصدرت "البرمجيات والأدوات الرقمية" الإيرادات بإجمالي $284,500 (+18.4% نمو شهري). بلغ معدل الاسترجاع 1.2% فقط، وهو أقل بكثير من متوسط التجارة الإلكترونية البالغ 4.8%.',
    chartTitle: 'الإيرادات حسب التصنيف (أكتوبر 2026)',
    verifiedBadge: 'تم التحقق بواسطة دليل المقاييس المعتمد',
    placeholderInput: 'قارن معدل التحويل عبر القنوات التسويقية المختلفة هذا الربع',
    ctaLaunchSandbox: 'ابدأ التجربة المجانية الكاملة',
    guidedTourBadge: 'جلسة إرشادية مخصصة',
    guidedTourTitle: 'احجز جلسة مراجعة معمارية 1-على-1',
    guidedTourSubtitle: 'تواصل مباشرة مع كبار مهندسي البيانات لاختبار me.inc على مستودع بياناتك، ومراجعة معايير الأمان، ومشاهدة النمذجة الدلالية مباشرة.',
    benefits: [
      'جلسة استعراض تقني مدتها 30 دقيقة مخصصة لنوع مستودع بياناتك',
      'إجابة كافة التساؤلات حول معمارية انعدام التخزين، وشبكات VPC، والصلاحيات',
      'نشر تجريبي مجاني لبيئة اختبار متكاملة مع فريقك',
    ],
    formTitle: 'احجز جلستك التقنية',
    formSubtitle: 'املأ بياناتك وسيتواصل معك أحد مهندسي الحلول خلال اليوم.',
    formEmail: 'البريد الإلكتروني للعمل',
    formFirstName: 'الاسم الأول',
    formLastName: 'اسم العائلة',
    formWarehouse: 'مستودع البيانات الرئيسي (Snowflake, BigQuery...)',
    formSubmit: 'تأكيد حجز العرض التجريبي',
  },
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? demoContent.ar : demoContent.en

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

        {/* Interactive Simulation Sandbox */}
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500" />
              <span className="size-3 rounded-full bg-amber" />
              <span className="size-3 rounded-full bg-emerald-500" />
              <span className="ms-2 font-mono text-xs text-muted-foreground">demo.me.inc / sandbox</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {t.badgeSandbox}
            </Badge>
          </div>

          {/* Chat demo body */}
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <span className="text-xs font-bold">{isAr ? 'أنت' : 'You'}</span>
              </div>
              <div className="rounded-2xl bg-muted/50 p-4 text-sm text-foreground">
                <p className="font-medium">
                  {t.userPrompt}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </div>
              <div className="flex-1 space-y-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{t.engineLabel}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{t.engineLatency}</span>
                </div>

                <p className="text-sm text-foreground leading-relaxed">
                  {t.agentAnswer}
                </p>

                {/* Simulated Chart preview */}
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    {t.chartTitle}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{isAr ? 'البرمجيات والأدوات الرقمية' : 'Digital Software & Tools'}</span>
                        <span className="font-semibold">$284,500 (1.2% {isAr ? 'مرتجع' : 'refunds'})</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{isAr ? 'الدورات والتعليم الرقمي' : 'Online Courses & Education'}</span>
                        <span className="font-semibold">$192,300 (2.4% {isAr ? 'مرتجع' : 'refunds'})</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: '58%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{isAr ? 'ملفات وقوالب التصميم' : 'Design Assets & Templates'}</span>
                        <span className="font-semibold">$118,700 (0.9% {isAr ? 'مرتجع' : 'refunds'})</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-amber rounded-full" style={{ width: '36%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                  <span className="rounded bg-muted px-2 py-0.5 font-mono">SQL: SELECT category, sum(revenue)...</span>
                  <span className="rounded bg-muted px-2 py-0.5">{t.verifiedBadge}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Input
              disabled
              placeholder={t.placeholderInput}
              value={t.placeholderInput}
              className="bg-muted/40 font-medium"
            />
            <Button render={<Link href="/login" />} nativeButton={false} className="shrink-0">
              {t.ctaLaunchSandbox} <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        {/* Demo Booking Section */}
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="new" className="mb-3">
              {t.guidedTourBadge}
            </Badge>
            <h2 className="heading-2 text-foreground mb-4">
              {t.guidedTourTitle}
            </h2>
            <p className="body text-muted-foreground mb-6">
              {t.guidedTourSubtitle}
            </p>

            <ul className="space-y-3">
              {t.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="p-8 border border-border">
            <h3 className="heading-3 text-foreground mb-2">{t.formTitle}</h3>
            <p className="caption text-muted-foreground mb-6">
              {t.formSubtitle}
            </p>
            <form className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">{t.formEmail}</label>
                <Input type="email" placeholder="you@company.com" className="mt-1" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">{t.formFirstName}</label>
                  <Input placeholder={isAr ? 'محمد' : 'Jane'} className="mt-1" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">{t.formLastName}</label>
                  <Input placeholder={isAr ? 'أحمد' : 'Doe'} className="mt-1" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">{t.formWarehouse}</label>
                <Input placeholder="Snowflake, BigQuery, Postgres..." className="mt-1" />
              </div>
              <Button type="button" className="w-full justify-center" size="lg">
                {t.formSubmit}
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
