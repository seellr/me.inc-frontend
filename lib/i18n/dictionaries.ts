export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ar'

export const dictionaries = {
  ar: {
    common: {
      language: 'العربية',
      switchLanguage: 'English',
    },
    nav: {
      search: 'بحث',
      cart: 'السلة',
      account: 'تسجيل الدخول / إنشاء حساب',
      categories: [
        {
          label: 'الملابس',
          columns: [
            {
              heading: 'حسب النوع',
              links: [
                { label: 'رجالي', href: '/category/men' },
                { label: 'نسائي', href: '/category/women' },
                { label: 'أطفال', href: '/category/kids' },
                { label: 'إكسسوارات', href: '/category/accessories' },
              ],
            },
            {
              heading: 'الأكثر رواجًا',
              links: [
                { label: 'وصل حديثًا', href: '/new' },
                { label: 'الأكثر مبيعًا', href: '/bestsellers' },
                { label: 'العروض', href: '/sale' },
                { label: 'المجموعات', href: '/collections' },
              ],
            },
          ],
          promo: {
            title: 'تخفيضات الموسم',
            description: 'خصم يصل إلى 40% على مجموعة مختارة',
            href: '/sale',
          },
        },
        {
          label: 'المتجر',
          columns: [
            {
              heading: 'تسوق حسب',
              links: [
                { label: 'كل المنتجات', href: '/shop' },
                { label: 'العلامات التجارية', href: '/brands' },
                { label: 'بطاقات الهدايا', href: '/gift-cards' },
              ],
            },
          ],
        },
        {
          label: 'عن المتجر',
          columns: [
            {
              heading: 'الشركة',
              links: [
                { label: 'من نحن', href: '/about' },
                { label: 'المدونة', href: '/blog' },
                { label: 'تواصل معنا', href: '/contact' },
              ],
            },
          ],
        },
      ],
      links: [{ label: 'الأسعار', href: '/pricing' }],
    },
    footer: {
      tagline: 'وجهتك المفضلة للتسوق بثقة وجودة.',
      newsletterLabel: 'اشترك في نشرتنا البريدية',
      newsletterPlaceholder: 'بريدك الإلكتروني...',
      columns: [
        {
          heading: 'المتجر',
          links: [
            { label: 'كل المنتجات', href: '/shop' },
            { label: 'وصل حديثًا', href: '/new' },
            { label: 'العروض', href: '/sale' },
            { label: 'بطاقات الهدايا', href: '/gift-cards' },
          ],
        },
        {
          heading: 'الشركة',
          links: [
            { label: 'من نحن', href: '/about' },
            { label: 'المدونة', href: '/blog' },
            { label: 'الوظائف', href: '/careers' },
            { label: 'تواصل معنا', href: '/contact' },
          ],
        },
        {
          heading: 'الدعم',
          links: [
            { label: 'الأسئلة الشائعة', href: '/faq' },
            { label: 'الشحن والإرجاع', href: '/shipping' },
            { label: 'سياسة الخصوصية', href: '/privacy' },
            { label: 'الشروط والأحكام', href: '/terms' },
          ],
        },
      ],
      copyright: '© {year} me.inc. جميع الحقوق محفوظة.',
    },
  },
  en: {
    common: {
      language: 'English',
      switchLanguage: 'العربية',
    },
    nav: {
      search: 'Search',
      cart: 'Cart',
      account: 'Login / Sign up',
      categories: [
        {
          label: 'Clothing',
          columns: [
            {
              heading: 'Shop by',
              links: [
                { label: 'Men', href: '/category/men' },
                { label: 'Women', href: '/category/women' },
                { label: 'Kids', href: '/category/kids' },
                { label: 'Accessories', href: '/category/accessories' },
              ],
            },
            {
              heading: 'Trending',
              links: [
                { label: 'New arrivals', href: '/new' },
                { label: 'Best sellers', href: '/bestsellers' },
                { label: 'Sale', href: '/sale' },
                { label: 'Collections', href: '/collections' },
              ],
            },
          ],
          promo: {
            title: 'Season sale',
            description: 'Up to 40% off a curated selection',
            href: '/sale',
          },
        },
        {
          label: 'Shop',
          columns: [
            {
              heading: 'Browse',
              links: [
                { label: 'All products', href: '/shop' },
                { label: 'Brands', href: '/brands' },
                { label: 'Gift cards', href: '/gift-cards' },
              ],
            },
          ],
        },
        {
          label: 'About',
          columns: [
            {
              heading: 'Company',
              links: [
                { label: 'About us', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          ],
        },
      ],
      links: [{ label: 'Pricing', href: '/pricing' }],
    },
    footer: {
      tagline: 'Your trusted destination for shopping with confidence and quality.',
      newsletterLabel: 'Subscribe to our newsletter',
      newsletterPlaceholder: 'your email...',
      columns: [
        {
          heading: 'Shop',
          links: [
            { label: 'All products', href: '/shop' },
            { label: 'New arrivals', href: '/new' },
            { label: 'Sale', href: '/sale' },
            { label: 'Gift cards', href: '/gift-cards' },
          ],
        },
        {
          heading: 'Company',
          links: [
            { label: 'About us', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          heading: 'Support',
          links: [
            { label: 'FAQ', href: '/faq' },
            { label: 'Shipping & returns', href: '/shipping' },
            { label: 'Privacy policy', href: '/privacy' },
            { label: 'Terms of service', href: '/terms' },
          ],
        },
      ],
      copyright: '© {year} me.inc. All rights reserved.',
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]
