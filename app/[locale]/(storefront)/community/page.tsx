import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, ExternalLink, GitBranch, MessageCircle } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'المجتمع - me.inc' : 'Community - me.inc',
    description: isAr
      ? 'انضم إلى مجتمعنا المزدهر من مهندسي البيانات ومعماريي الذكاء الاصطناعي ورواد الأعمال.'
      : 'Join our thriving community of data engineers, AI architects, and analytics leaders.',
  }
}

const communityContent = {
  en: {
    eyebrow: 'Community',
    heading: 'Connect with the future of data engineering',
    subheading: 'Join thousands of data practitioners, AI engineers, and forward-thinking leaders shaping the future of autonomous business intelligence.',
    eventsHeading: 'Upcoming Community Events',
    eventsSubtitle: 'Join live interactive workshops, webinars, and office hours.',
    rsvpButton: 'RSVP Free',
    presentedBy: 'Presented by',
    guidelinesTitle: 'Built on open collaboration & trust',
    guidelinesBody: 'Our community strictly follows our Code of Conduct: respectful debate, open sharing of knowledge, and mutual technical mentorship.',
    guidelinesCta: 'Read Community Docs',
    channels: [
      {
        icon: MessageSquare,
        name: 'Slack Community',
        members: '5,000+ members',
        description: 'Ask questions, share semantic models, get instant peer feedback, and chat directly with me.inc core maintainers.',
        cta: 'Join Slack Workspace',
        href: 'https://slack.com',
      },
      {
        icon: GitBranch,
        name: 'GitHub Discussions',
        members: 'Open Source Hub',
        description: 'Participate in RFCs, report bugs, review code architecture proposals, and contribute to our open connectors.',
        cta: 'View GitHub Discussions',
        href: 'https://github.com',
      },
      {
        icon: MessageCircle,
        name: 'Discord Server',
        members: 'Real-time Voice & Chat',
        description: 'Casual community hangouts, hackathons, and informal discussions around LLMs and modern data stacks.',
        cta: 'Join Discord',
        href: 'https://discord.com',
      },
    ],
    upcomingEvents: [
      {
        title: 'Agentic BI Architecture: Eliminating the Analyst Backlog',
        date: 'Dec 4, 2026',
        time: '5:00 PM UTC',
        host: 'Core Architecture Team',
        tag: 'Webinar & Q&A',
      },
      {
        title: 'Building Governed Semantic Layers on Snowflake & BigQuery',
        date: 'Dec 11, 2026',
        time: '4:00 PM UTC',
        host: 'Solutions Engineering',
        tag: 'Hands-on Workshop',
      },
      {
        title: 'Monthly Open Office Hours & Roadmap Sneak Peek',
        date: 'Dec 18, 2026',
        time: '6:00 PM UTC',
        host: 'Product Management',
        tag: 'Community Hangout',
      },
    ],
  },
  ar: {
    eyebrow: 'المجتمع والملتقى',
    heading: 'تواصل مع رواد هندسة البيانات والذكاء الاصطناعي',
    subheading: 'انضم إلى آلاف المهندسين والمحللين وقادة الأعمال الذين يصنعون معاً مستقبل ذكاء الأعمال المستقل.',
    eventsHeading: 'الفعاليات وورش العمل القادمة',
    eventsSubtitle: 'شارك في ورش العمل التفاعلية والندوات المباشرة وساعات العمل المفتوحة.',
    rsvpButton: 'حجز مجاني',
    presentedBy: 'يقدمها',
    guidelinesTitle: 'مبني على التعاون المفتوح والثقة المتبادلة',
    guidelinesBody: 'يلتزم مجتمعنا بقواعد سلوك واضحة: حوار مهني محترم، وتبادل مفتوح للخبرات، وإرشاد تقني متبادل بين الأعضاء.',
    guidelinesCta: 'الاطلاع على وثيقة المجتمع',
    channels: [
      {
        icon: MessageSquare,
        name: 'مجتمع Slack',
        members: '+5,000 عضو',
        description: 'اطرح تساؤلاتك، وشارك نماذجك الدلالية، واحصل على إجابات مباشرة من مطوري منصة me.inc.',
        cta: 'الانضمام لمساحة سلاك',
        href: 'https://slack.com',
      },
      {
        icon: GitBranch,
        name: 'نقاشات GitHub',
        members: 'مركز المصدر المفتوح',
        description: 'شارك في مقترحات التحسين (RFCs)، وأبلغ عن المشكلات، وساهم في تطوير موصلات قواعد البيانات المفتوحة.',
        cta: 'فتح نقاشات جيت هب',
        href: 'https://github.com',
      },
      {
        icon: MessageCircle,
        name: 'سيرفر Discord',
        members: 'محادثات صوتية وحية',
        description: 'لقاءات مجتمعية غير رسمية وهاكاثونات ومناقشات حرة حول أحدث تقنيات نماذج اللغة والبيانات.',
        cta: 'الانضمام لدسكورد',
        href: 'https://discord.com',
      },
    ],
    upcomingEvents: [
      {
        title: 'معمارية ذكاء الأعمال الوكيلي: القضاء على طوابير طلبات التحليل',
        date: '4 ديسمبر 2026',
        time: '5:00 مساءً بتوقيت مكة',
        host: 'فريق المعمارية الأساسي',
        tag: 'ندوة وجلسة أسئلة',
      },
      {
        title: 'بناء الطبقات الدلالية المعتمدة على Snowflake و BigQuery',
        date: '11 ديسمبر 2026',
        time: '4:00 مساءً بتوقيت مكة',
        host: 'هندسة الحلول',
        tag: 'ورشة تطبيقية',
      },
      {
        title: 'ساعات العمل المفتوحة الشهرية ونظرة مسبقة على خارطة الطريق',
        date: '18 ديسمبر 2026',
        time: '6:00 مساءً بتوقيت مكة',
        host: 'إدارة المنتجات',
        tag: 'لقاء مجتمعي مفتوح',
      },
    ],
  },
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAr = locale === 'ar'
  const t = isAr ? communityContent.ar : communityContent.en

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

        {/* Channels Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {t.channels.map((ch) => (
            <Card key={ch.name} className="flex flex-col justify-between p-8 border border-border">
              <div>
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <ch.icon className="size-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="heading-3 text-foreground">{ch.name}</h3>
                  <Badge variant="outline" className="text-xs">{ch.members}</Badge>
                </div>
                <p className="caption text-muted-foreground mt-3 leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border">
                <a
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <span>{ch.cta}</span>
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="text-center mb-8">
            <h2 className="heading-2 text-foreground">{t.eventsHeading}</h2>
            <p className="caption mt-2 text-muted-foreground">{t.eventsSubtitle}</p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {t.upcomingEvents.map((evt) => (
              <Card key={evt.title} className="p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="new" className="text-[10px]">{evt.tag}</Badge>
                    <span className="text-xs text-muted-foreground">{evt.date} • {evt.time}</span>
                  </div>
                  <h4 className="font-heading font-semibold text-foreground text-base">{evt.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.presentedBy} {evt.host}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  {t.rsvpButton}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Guidelines Card */}
        <Card className="rounded-3xl bg-muted/30 p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="heading-3 text-foreground mb-2">{t.guidelinesTitle}</h3>
            <p className="caption text-muted-foreground">
              {t.guidelinesBody}
            </p>
          </div>
          <Button render={<Link href="/docs" />} nativeButton={false} variant="outline" className="shrink-0">
            {t.guidelinesCta}
          </Button>
        </Card>
      </Container>
    </Section>
  )
}
