import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

function backendPattern(): { protocol: 'http' | 'https'; hostname: string; port?: string } | null {
  const raw =
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000';
  try {
    const url = new URL(raw);
    return {
      protocol: url.protocol === 'https:' ? 'https' : 'http',
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return null;
  }
}

const mediaPattern = backendPattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      ...(mediaPattern ? [mediaPattern] : []),
    ],
  },
};

export default withNextIntl(nextConfig);
