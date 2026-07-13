import type { StoreCategory, StoreProduct } from '@/types/commerce'

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    slug: 'books',
    name: 'كتب رقمية',
    heading: 'معرفة تقرأها في أي مكان',
    body: 'كتب إلكترونية عربية مختارة بعناية في ريادة الأعمال والتسويق والتطوير الذاتي، تصلك فور الشراء.',
    image: '/images/editorial/cat-books.svg',
    color: 'pink',
  },
  {
    slug: 'courses',
    name: 'دورات تدريبية',
    heading: 'تعلّم من خبراء المجال',
    body: 'دورات فيديو عملية خطوة بخطوة، بشهادات إتمام ووصول مدى الحياة لكل التحديثات.',
    image: '/images/editorial/cat-courses.svg',
    color: 'teal',
  },
  {
    slug: 'tools',
    name: 'قوالب وأدوات',
    heading: 'أنجز أسرع بأدوات جاهزة',
    body: 'قوالب تصميم وجداول عمل وأدوات ذكاء اصطناعي توفر عليك ساعات من العمل اليدوي.',
    image: '/images/editorial/cat-tools.svg',
    color: 'green',
  },
]

// Demo catalog — stands in for a real backend until one is wired up.
export const FALLBACK_PRODUCTS: StoreProduct[] = [
  {
    id: 'demo-01', slug: 'ecommerce-playbook', name: 'دليل التجارة الإلكترونية الشامل', nameAr: 'دليل التجارة الإلكترونية الشامل',
    category: 'كتب رقمية', categorySlug: 'books', price: 149, image: '/images/products/ebook.svg',
    description: 'كتاب رقمي من ٣٢٠ صفحة يأخذك من فكرة المتجر إلى أول ١٠٠ عملية بيع، بخطط عمل قابلة للتطبيق فورًا.',
    rating: 4.8, reviews: 214, featured: true,
  },
  {
    id: 'demo-02', slug: 'content-writing-course', name: 'دورة كتابة المحتوى التسويقي', nameAr: 'دورة كتابة المحتوى التسويقي',
    category: 'دورات تدريبية', categorySlug: 'courses', price: 399, image: '/images/products/course.svg',
    description: 'أكثر من ٤٠ درس فيديو عملي تتعلم فيها صناعة محتوى يبيع، مع تمارين وملفات عمل ومجتمع خاص.',
    rating: 4.9, reviews: 187, variants: ['أساسية', 'مع جلسة إرشاد'], featured: true,
  },
  {
    id: 'demo-03', slug: 'notion-business-templates', name: 'حزمة قوالب نوشن للأعمال', nameAr: 'حزمة قوالب نوشن للأعمال',
    category: 'قوالب وأدوات', categorySlug: 'tools', price: 89, image: '/images/products/template.svg',
    description: '١٢ قالب نوشن جاهز لإدارة المشاريع والمهام والمحتوى والعملاء، بواجهة عربية كاملة.',
    rating: 4.7, reviews: 342, featured: true,
  },
  {
    id: 'demo-04', slug: 'seo-mastery-ebook', name: 'كتاب احتراف السيو بالعربي', nameAr: 'كتاب احتراف السيو بالعربي',
    category: 'كتب رقمية', categorySlug: 'books', price: 119, image: '/images/products/ebook.svg',
    description: 'مرجع عملي لتصدّر نتائج البحث العربية: بحث الكلمات، بناء الروابط، وتحسين المحتوى.',
    rating: 4.6, reviews: 98,
  },
  {
    id: 'demo-05', slug: 'video-editing-bootcamp', name: 'معسكر مونتاج الفيديو', nameAr: 'معسكر مونتاج الفيديو',
    category: 'دورات تدريبية', categorySlug: 'courses', price: 549, image: '/images/products/webinar.svg',
    description: 'من الصفر إلى الاحتراف في المونتاج: قص، تلوين، صوت، وموشن جرافيك بمشاريع حقيقية.',
    rating: 4.8, reviews: 156, variants: ['تسجيلات فقط', 'مع متابعة مباشرة'],
  },
  {
    id: 'demo-06', slug: 'ai-prompts-toolkit', name: 'عدة أوامر الذكاء الاصطناعي', nameAr: 'عدة أوامر الذكاء الاصطناعي',
    category: 'قوالب وأدوات', categorySlug: 'tools', price: 69, image: '/images/products/software.svg',
    description: '٥٠٠+ أمر جاهز للتسويق والكتابة والتصميم، منظمة حسب المهمة ومجربة على أحدث النماذج.',
    rating: 4.5, reviews: 421,
  },
  {
    id: 'demo-07', slug: 'freelance-starter-book', name: 'كتاب انطلاقة المستقل', nameAr: 'كتاب انطلاقة المستقل',
    category: 'كتب رقمية', categorySlug: 'books', price: 99, image: '/images/products/ebook.svg',
    description: 'كيف تبني مسيرة عمل حر مستقرة: التسعير، العقود، وجذب العملاء الأوائل.',
    rating: 4.7, reviews: 133,
  },
  {
    id: 'demo-08', slug: 'brand-identity-course', name: 'دورة بناء الهوية البصرية', nameAr: 'دورة بناء الهوية البصرية',
    category: 'دورات تدريبية', categorySlug: 'courses', price: 449, image: '/images/products/course.svg',
    description: 'صمّم هويات علامات تجارية متكاملة: الشعار، الألوان، الخطوط، ودليل الاستخدام.',
    rating: 4.9, reviews: 76,
  },
  {
    id: 'demo-09', slug: 'social-media-bundle', name: 'باقة إدارة السوشيال ميديا', nameAr: 'باقة إدارة السوشيال ميديا',
    category: 'قوالب وأدوات', categorySlug: 'tools', price: 199, image: '/images/products/bundle.svg',
    description: 'تقويم محتوى + ٢٠٠ تصميم قابل للتعديل + دليل خوارزميات المنصات في باقة واحدة.',
    rating: 4.6, reviews: 254, featured: true,
  },
]

export async function getStoreProducts(_revalidate = 300): Promise<StoreProduct[]> {
  return FALLBACK_PRODUCTS
}

export async function getStoreProduct(slug: string, _revalidate = 60): Promise<StoreProduct | null> {
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null
}
