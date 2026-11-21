import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, ArrowRight, Tag, CheckCircle2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'سجل التحديثات - me.inc' : 'Changelog - me.inc',
    description: isAr
      ? 'أحدث مميزات المنصة وتحديثات الأداء والتحسينات التي يطلقها فريق me.inc.'
      : 'Latest product updates, new releases, and improvements shipped by me.inc.',
  }
}

interface Release {
  version: string
  date: string
  title: string
  tag: string
  summary: string
  highlights: string[]
}

const changelogContent = {
  en: {
    eyebrow: 'Product Updates',
    heading: 'Changelog',
    subheading: 'Follow along with the latest releases, performance upgrades, and architectural enhancements shipped across the me.inc platform.',
    shippedTitle: 'What shipped in this release',
    ctaTitle: 'Want product updates straight to your inbox?',
    ctaSubtitle: 'Get notified about feature launches, engineering deep dives, and upcoming roadmap milestones.',
    ctaButton: 'Join Our Community for Live Alerts',
    releases: [
      {
        version: 'v2.4.0',
        date: 'November 15, 2026',
        title: 'Agentic BI 2.0 & Auto-Semantic Modeling',
        tag: 'Major Release',
        summary: 'A complete overhaul of our agentic engine, enabling multi-step autonomous data discovery and automated dbt metric reconciliation.',
        highlights: [
          'Self-healing query planner: automatically retries and fixes ambiguous column join paths.',
          'Snowflake zero-copy clone integration for instant dev-test analytical sandboxes.',
          'Native Slack bot streaming answers directly into executive channels.',
          '40% speed improvement on semantic cache warm-ups.',
        ],
      },
      {
        version: 'v2.3.2',
        date: 'October 28, 2026',
        title: 'Conversational Voice Input & Instant Chart Export',
        tag: 'Feature',
        summary: 'Speak your analytical questions in real-time with instant audio transcription and one-click SVG/Figma chart exporting.',
        highlights: [
          'Low-latency voice querying with support for English and Arabic speech.',
          'Direct copy-as-PNG, vector SVG, and Figma Code Connect exports.',
          'Custom metric formatting filters for currencies, percentages, and scientific units.',
        ],
      },
      {
        version: 'v2.3.0',
        date: 'September 30, 2026',
        title: 'Metrics Catalog Versioning & Interactive Lineage Graphs',
        tag: 'Feature',
        summary: 'Track how every KPI was calculated over time, with full Git-like commit histories and upstream database lineage visualization.',
        highlights: [
          'Visual DAG displaying upstream table dependencies and downstream dashboard usage.',
          'Metric change alerts: notify stakeholders when a definition changes in code.',
          'Role-based approvals for metric definition modifications.',
        ],
      },
      {
        version: 'v2.2.0',
        date: 'August 14, 2026',
        title: 'Embedded Analytics SDK v2 & Dark Mode Themes',
        tag: 'Improvement',
        summary: 'Our zero-iframe embedded SDK now supports full CSS-in-JS style injection, responsive widget resizing, and multi-tenant JWT scoping.',
        highlights: [
          'Zero-iframe React & Vue web component wrappers.',
          'Row-level tenant isolation via cryptographically signed JWT tokens.',
          'Comprehensive performance optimizations for mobile web dashboards.',
        ],
      },
    ] as Release[],
  },
  ar: {
    eyebrow: 'تحديثات المنتج',
    heading: 'سجل التحديثات والإصدارات',
    subheading: 'تابع كل المزايا الجديدة، وتحسينات الأداء، والترقيات الهندسية التي يتم إطلاقها تباعاً في منصة me.inc.',
    shippedTitle: 'أبرز ما تم إطلاقه في هذا الإصدار',
    ctaTitle: 'هل ترغب في وصول التحديثات إلى بريدك مباشرة؟',
    ctaSubtitle: 'احصل على إشعارات فورية عند إطلاق المزايا الجديدة والمقالات الهندسية ومحطات خارطة الطريق.',
    ctaButton: 'انضم إلى مجتمعنا للحصول على تنبيهات حية',
    releases: [
      {
        version: 'v2.4.0',
        date: '15 نوفمبر 2026',
        title: 'ذكاء الأعمال الوكيلي 2.0 والنمذجة الدلالية التلقائية',
        tag: 'إصدار رئيسي',
        summary: 'ترقية شاملة لمحرك الوكلاء، تدعم استكشاف البيانات المستقل عبر خطوات متعددة ومطابقة مقاييس dbt تلقائياً.',
        highlights: [
          'مخطط استعلامات ذاتي الإصلاح: يعيد المحاولة ويصلح مسارات الربط بين الأعمدة تلقائياً.',
          'تكامل فوري مع النسخ المتطابق لـ Snowflake لإنشاء بيئات تجريبية فورية.',
          'روبوت مدمج لـ Slack لبث الإجابات التحليلية مباشرة في قنوات الإدارة.',
          'تحسن بنسبة 40% في سرعة استجابة الذاكرة الدلالية المؤقتة.',
        ],
      },
      {
        version: 'v2.3.2',
        date: '28 أكتوبر 2026',
        title: 'الاستعلام الصوتي الحواري وتصدير المخططات الفوري',
        tag: 'ميزة جديدة',
        summary: 'اطرح أسئلتك التحليلية صوتياً باللغتين العربية والإنجليزية مع التصدير بنقرة زر إلى صيغ SVG أو Figma.',
        highlights: [
          'استعلام صوتي منخفض الكمون مع دعم كامل ودقيق للكلام باللغتين العربية والإنجليزية.',
          'تصدير مباشر للمخططات بصيغ PNG وصيغ متجهة SVG وعبر Figma Code Connect.',
          'تنسيق مخصص للمقاييس كالعملات والنسب المئوية والوحدات العلمية.',
        ],
      },
      {
        version: 'v2.3.0',
        date: '30 سبتمبر 2026',
        title: 'إصدارات دليل المقاييس والرسوم البيانية التفاعلية للمسارات',
        tag: 'ميزة جديدة',
        summary: 'تتبع تاريخ حساب كل مؤشر أداء زمني مع سجل تغييرات مشابه لـ Git ورؤية بصرية لمسار البيانات من المنبع.',
        highlights: [
          'رسم بياني موجه (DAG) يوضح اعتمادية الجداول واستخدامات لوحات التحكم التابعة.',
          'تنبيهات فورية عند تعديل صياغة أي مؤشر أو مقياس في الكود البرمجي.',
          'موافقات مبنية على الأدوار والصلاحيات عند تعديل تعريفات المقاييس.',
        ],
      },
      {
        version: 'v2.2.0',
        date: '14 أغسطس 2026',
        title: 'حزمة SDK للتحليلات المضمنة v2 والسمات المظلمة',
        tag: 'تحسين',
        summary: 'حزمة التضمين الخفيفة بدون iframe تدعم الآن حقن الأنماط المخصصة، والأبعاد المتجاوبة، وعزل البيانات عبر JWT.',
        highlights: [
          'مكونات ويب خفيفة تعمل مع React و Vue بدون الحاجة لـ iframe.',
          'عزل صارم للبيانات بين العملاء عبر رموز JWT المشفرة رقمياً.',
          'تحسينات أداء شاملة للوحات التحكم على أجهزة الهواتف الذكية.',
        ],
      },
    ] as Release[],
  },
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? changelogContent.ar : changelogContent.en

  return (
    <Section as="div" className="section-y">
      <Container className="flex flex-col gap-12">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="eyebrow" className="mb-4">
            {t.eyebrow}
          </Badge>
          <h1 className="heading-1 mb-4 text-foreground">{t.heading}</h1>
          <p className="body max-w-2xl text-muted-foreground">
            {t.subheading}
          </p>
        </div>

        {/* Timeline List */}
        <div className="mx-auto w-full max-w-4xl space-y-10">
          {t.releases.map((release) => (
            <Card key={release.version} className="p-8 border border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-xl font-bold text-foreground">
                    {release.version}
                  </span>
                  <Badge
                    variant={release.tag.includes('Major') || release.tag.includes('رئيسي') ? 'new' : 'outline'}
                    className="text-xs"
                  >
                    {release.tag}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>{release.date}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="heading-3 mb-2 text-foreground">{release.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {release.summary}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-muted/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" /> {t.shippedTitle}
                </p>
                <ul className="space-y-2">
                  {release.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Subscribe Banner */}
        <div className="mx-auto w-full max-w-4xl rounded-3xl bg-muted/30 p-8 border border-border text-center flex flex-col items-center">
          <Tag className="size-8 text-primary mb-3" />
          <h3 className="heading-3 text-foreground mb-2">{t.ctaTitle}</h3>
          <p className="caption max-w-md text-muted-foreground mb-6">
            {t.ctaSubtitle}
          </p>
          <Button render={<Link href="/community" />} nativeButton={false} variant="default">
            {t.ctaButton} <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </Container>
    </Section>
  )
}
