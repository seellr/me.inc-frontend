import BottomOverlay from "@/components/BottomOverlay";
import { CtaSection } from "@/components/home/CtaSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { SplitStorySection } from "@/components/home/SplitStorySection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { LatestProductsSection } from "@/components/home/LatestProductsSection";
import { FeaturedProductSection } from "@/components/home/FeaturedProductSection";
import { AnimatedLine } from "@/components/ui/AnimatedLine";
import { STORE_CATEGORIES, getStoreProducts } from "@/lib/store-data";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const products = await getStoreProducts(3600)
  const featuredProduct = products.find((p) => p.featured) ?? products[0]
  const latestProducts = products.filter((p) => p.slug !== featuredProduct?.slug).slice(0, 8)

  return (
    <>
      <BottomOverlay />
      <HeroSection />
      <IntroSection />

      {/* Narrative thread: straight drop into the story section */}
      <AnimatedLine
        d="M50 0 V100"
        viewBox="0 0 100 100"
        className="mx-auto -mb-8 block h-24 w-px"
        strokeWidth={2}
      />

      <SplitStorySection />

      {/* L-shaped connector into features */}
      <AnimatedLine
        d="M80 0 V50 H20 V100"
        viewBox="0 0 100 100"
        className="mx-auto -my-4 block h-28 w-full max-w-3xl"
        strokeWidth={0.5}
      />

      <FeaturesSection />

      <CategoriesSection categories={STORE_CATEGORIES} />

      {featuredProduct && <FeaturedProductSection product={featuredProduct} />}

      <LatestProductsSection products={latestProducts} />

      {/* Curved connector into the showcase */}
      <AnimatedLine
        d="M15 0 C 40 60, 70 40, 85 100"
        viewBox="0 0 100 100"
        className="mx-auto -my-6 block h-32 w-full max-w-2xl"
        strokeWidth={0.6}
      />

      <ShowcaseSection />
      <CtaSection />
    </>
  )
}
