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
import { BundlesSection } from "@/components/home/BundlesSection";
import { AnimatedLine } from "@/components/ui/AnimatedLine";
import { STORE_CATEGORIES } from "@/lib/store-data";
import { storeFetchServer } from "@/lib/store/api-server";
import { productToStoreProduct } from "@/lib/store/adapters";
import { setRequestLocale } from "next-intl/server";
import type { Product } from "@/types/dto/product.dto";

export const dynamic = 'force-dynamic';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const result = await storeFetchServer<Product[]>('/products', 0)
  const products = (result.ok ? result.data : []).map(productToStoreProduct)
  const featuredProduct = products.find((p) => p.featured) ?? products[0]
  const latestProducts = products.filter((p) => p.slug !== featuredProduct?.slug).slice(0, 8)
  // ProductType id 6 = Bundle (types/dto/product.dto.ts ProductTypeLabels)
  const bundleProducts = products.filter((p) => p.categorySlug === '6')

  return (
    <>
      <BottomOverlay />
      <HeroSection />
      <IntroSection />
      <SplitStorySection />

      <AnimatedLine
        d="M80 0 V50 H20 V100"
        viewBox="0 0 100 100"
        className="mx-auto -my-4 block h-28 w-full max-w-3xl"
        strokeWidth={1}
      />

      <FeaturesSection />

      <CategoriesSection categories={STORE_CATEGORIES} />

      {featuredProduct && <FeaturedProductSection product={featuredProduct} />}

      <LatestProductsSection products={latestProducts} />

      <BundlesSection products={bundleProducts} />

      {/* Curved connector into the showcase */}
      <AnimatedLine
        d="M15 0 C 40 60, 70 40, 85 100"
        viewBox="0 0 100 100"
        className="mx-auto -my-6 block h-32 w-full max-w-2xl"
        strokeWidth={1}
      />

      <ShowcaseSection />
      <CtaSection />
    </>
  )
}
