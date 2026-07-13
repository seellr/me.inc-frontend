import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/utils/constants";

export const locales = SUPPORTED_LOCALES;
export const defaultLocale = DEFAULT_LOCALE;

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = SUPPORTED_LOCALES.includes(requested as (typeof SUPPORTED_LOCALES)[number])
        ? (requested as (typeof SUPPORTED_LOCALES)[number])
        : defaultLocale;

    const messages = {
        common: (await import(`../messages/${locale}/common.json`)).default,
        nav: (await import(`../messages/${locale}/nav.json`)).default,
        footer: (await import(`../messages/${locale}/footer.json`)).default,
        hero: (await import(`../messages/${locale}/hero.json`)).default,
        home: (await import(`../messages/${locale}/home.json`)).default,
        products: (await import(`../messages/${locale}/products.json`)).default,
        cart: (await import(`../messages/${locale}/cart.json`)).default,
        checkout: (await import(`../messages/${locale}/checkout.json`)).default,
        orderLookup: (await import(`../messages/${locale}/orderLookup.json`)).default,
    };

    return {
        locale,
        messages,
    };
});
