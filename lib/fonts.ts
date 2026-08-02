import localFont from 'next/font/local'

export const chillax = localFont({
  src: [
    { path: '../public/fonts/chillax/Chillax-Regular.woff2', weight: '400' },
    { path: '../public/fonts/chillax/Chillax-Medium.woff2', weight: '500' },
    { path: '../public/fonts/chillax/Chillax-Semibold.woff2', weight: '600' },
    { path: '../public/fonts/chillax/Chillax-Bold.woff2', weight: '700' },
  ],
  variable: '--font-chillax',
  fallback: ['DM Sans', 'Inter', 'sans-serif'],
  display: 'swap',
})

export const thmanyah = localFont({
  src: [
    { path: '../public/fonts/thmanyah/Thmanyah-Regular.woff2', weight: '400' },
    { path: '../public/fonts/thmanyah/Thmanyah-Bold.woff2', weight: '700' },
  ],
  variable: '--font-thmanyah',
  fallback: ['Cairo', 'Tajawal', 'sans-serif'],
  display: 'swap',
})
