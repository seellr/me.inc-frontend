import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { RevealOnScroll, StaggerGrid } from '@/components/motion'
import type { StoreCategory } from '@/types/commerce'

export function CategoriesSection({ categories }: { categories: StoreCategory[] }) {
  const t = useTranslations('home')

  return (
    <Section>
      <Container>
        <RevealOnScroll className="mb-10 max-w-xl">
          <p className="eyebrow mb-3">{t('categoriesEyebrow')}</p>
          <h2 className="heading-2">{t('categoriesHeading')}</h2>
        </RevealOnScroll>

        <StaggerGrid className="grid gap-5 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-muted p-6 no-underline"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
              <div className="relative flex flex-col gap-1 text-background">
                <span className="text-lg font-semibold">{category.name}</span>
                <span className="line-clamp-2 text-sm opacity-80">{category.body}</span>
              </div>
            </Link>
          ))}
        </StaggerGrid>
      </Container>
    </Section>
  )
}
