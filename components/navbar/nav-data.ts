export type IconGradient = 'purple' | 'green' | 'blue' | 'orange' | 'pink'

export const gradientClass: Record<IconGradient, string> = {
  purple: 'bg-gradient-to-br from-violet-500 to-indigo-600',
  green: 'bg-gradient-to-br from-emerald-400 to-teal-600',
  blue: 'bg-gradient-to-br from-sky-400 to-blue-600',
  orange: 'bg-gradient-to-br from-amber-400 to-orange-600',
  pink: 'bg-gradient-to-br from-pink-400 to-rose-600',
}

export interface LinkItem {
  title: string
  subtitle: string
  href: string
  icon: IconGradient
}

export interface PromoCard {
  title: string
  subtitle: string
  href: string
}

export interface StoryCard {
  logo: string
  title: string
  href: string
}

export interface LinkColumn {
  heading?: string
  items: LinkItem[]
}

export type NavMenu =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'product'; label: string; columns: LinkColumn[]; promos: PromoCard[] }
  | { kind: 'customers'; label: string; heading: string; cards: StoryCard[]; viewAllHref: string }
  | { kind: 'resources'; label: string; promos: PromoCard[]; columns: LinkColumn[] }

export const navMenusEn: NavMenu[] = [
  { kind: 'link', label: 'Shop', href: '/products' },
  {
    kind: 'product',
    label: 'Product',
    columns: [
      {
        heading: 'Product',
        items: [
          { title: 'Conversational analytics', subtitle: 'Ask AI questions in plain English', href: '/product/conversational-analytics', icon: 'purple' },
          { title: 'Data apps', subtitle: 'Build apps on governed data', href: '/product/data-apps', icon: 'blue' },
          { title: 'Metrics Catalog', subtitle: 'Every KPI in one trusted place', href: '/product/metrics-catalog', icon: 'green' },
          { title: 'Embedded analytics', subtitle: 'AI-powered insights anywhere', href: '/product/embedded-analytics', icon: 'pink' },
          { title: 'Interactive dashboards', subtitle: 'Dig into every number', href: '/product/dashboards', icon: 'orange' },
        ],
      },
      {
        heading: 'Platform',
        items: [
          { title: 'Agentic BI', subtitle: 'Build & maintain dashboards in code', href: '/platform/agentic-bi', icon: 'purple' },
          { title: 'Integrations', subtitle: 'Use the tools you already love', href: '/platform/integrations', icon: 'blue' },
        ],
      },
    ],
    promos: [
      { title: 'Changelog', subtitle: 'Check out our latest product updates', href: '/changelog' },
      { title: 'Try Live demo', subtitle: 'Give the product a go', href: '/demo' },
    ],
  },
  { kind: 'link', label: 'Pricing', href: '/pricing' },
  {
    kind: 'customers',
    label: 'Customers',
    heading: 'Featured Customer Stories',
    cards: [
      { logo: 'fal', title: 'How fal uses Agentic BI to run data for 80 people with a team of one', href: '/customers/fal' },
      { logo: 'Gen', title: "How Gen H's CCO shipped production metrics in two days using Agentic BI", href: '/customers/gen-h' },
      { logo: 'JustWatch', title: 'How JustWatch built an AI-powered data culture', href: '/customers/justwatch' },
    ],
    viewAllHref: '/customers',
  },
  {
    kind: 'resources',
    label: 'Resources',
    promos: [
      { title: 'Docs', subtitle: 'Get stuck in', href: '/docs' },
      { title: 'Lightning Posts', subtitle: 'Our blog', href: '/blog' },
    ],
    columns: [
      {
        items: [
          { title: 'About Us', subtitle: 'Our story so far…', href: '/about', icon: 'green' },
          { title: 'Product Roadmap', subtitle: 'Have a peek at our plans', href: '/roadmap', icon: 'blue' },
        ],
      },
      {
        items: [
          { title: 'Community', subtitle: 'Join our Slack Community!', href: '/community', icon: 'purple' },
          { title: 'Partnerships', subtitle: 'Partner with us!', href: '/partners', icon: 'orange' },
        ],
      },
    ],
  },
]

export const navMenusAr: NavMenu[] = [
  { kind: 'link', label: 'المتجر', href: '/products' },
  {
    kind: 'product',
    label: 'المنتجات',
    columns: [
      {
        heading: 'المنتجات',
        items: [
          { title: 'التحليلات الحوارية', subtitle: 'اسأل الذكاء الاصطناعي بلغة طبيعية', href: '/product/conversational-analytics', icon: 'purple' },
          { title: 'تطبيقات البيانات', subtitle: 'ابنِ تطبيقات على بيانات موثوقة', href: '/product/data-apps', icon: 'blue' },
          { title: 'دليل المقاييس', subtitle: 'كل المؤشرات في مكان واحد موحد', href: '/product/metrics-catalog', icon: 'green' },
          { title: 'التحليلات المضمنة', subtitle: 'رؤى ذكية ومضمنة في أي مكان', href: '/product/embedded-analytics', icon: 'pink' },
          { title: 'لوحات تحكم تفاعلية', subtitle: 'استكشف كل رقم بتفاصيله الدقيقة', href: '/product/dashboards', icon: 'orange' },
        ],
      },
      {
        heading: 'المنصة',
        items: [
          { title: 'ذكاء الأعمال الوكيلي', subtitle: 'ابنِ لوحات التحكم وقم بصيانتها ككود', href: '/platform/agentic-bi', icon: 'purple' },
          { title: 'التكاملات والربط', subtitle: 'استخدم الأدوات التي تفضلها بالفعل', href: '/platform/integrations', icon: 'blue' },
        ],
      },
    ],
    promos: [
      { title: 'سجل التحديثات', subtitle: 'اطّلع على أحدث مميزات منتجنا', href: '/changelog' },
      { title: 'جرّب النسخة الحية', subtitle: 'اختبر المنصة مباشرة في متصفحك', href: '/demo' },
    ],
  },
  { kind: 'link', label: 'الأسعار', href: '/pricing' },
  {
    kind: 'customers',
    label: 'عملاؤنا',
    heading: 'قصص نجاح مميزة',
    cards: [
      { logo: 'fal', title: 'كيف تستخدم fal ذكاء الأعمال الوكيلي لإدارة بيانات 80 موظفاً بفريق من شخص واحد', href: '/customers/fal' },
      { logo: 'Gen', title: 'كيف أطلق CCO في Gen H مقاييس الإنتاج في يومين فقط عبر ذكاء الأعمال الوكيلي', href: '/customers/gen-h' },
      { logo: 'JustWatch', title: 'كيف بنت JustWatch ثقافة بيانات مدعومة بالذكاء الاصطناعي في 40+ سوقاً', href: '/customers/justwatch' },
    ],
    viewAllHref: '/customers',
  },
  {
    kind: 'resources',
    label: 'المصادر',
    promos: [
      { title: 'التوثيق التقني', subtitle: 'ابدأ التطوير والبناء', href: '/docs' },
      { title: 'المدونة التقنية', subtitle: 'مقالات معمقة وأفكار هندسية', href: '/blog' },
    ],
    columns: [
      {
        items: [
          { title: 'من نحن', subtitle: 'قصتنا ومهمتنا حتى الآن…', href: '/about', icon: 'green' },
          { title: 'خارطة الطريق', subtitle: 'نظرة على خططنا المستقبلية', href: '/roadmap', icon: 'blue' },
        ],
      },
      {
        items: [
          { title: 'المجتمع', subtitle: 'انضم إلى مجتمع سلاك النشط!', href: '/community', icon: 'purple' },
          { title: 'الشراكات', subtitle: 'كن شريكاً رسمياً معنا!', href: '/partners', icon: 'orange' },
        ],
      },
    ],
  },
]

export function getNavMenus(locale?: string): NavMenu[] {
  return locale === 'ar' ? navMenusAr : navMenusEn
}

export const navMenus: NavMenu[] = navMenusEn
