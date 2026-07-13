import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import type { PromoCard as PromoCardData } from './nav-data'

const confettiSquares = [
  'absolute top-2 end-2 size-3 rounded-sm bg-violet-500/90',
  'absolute top-6 end-5 size-2 rounded-sm bg-emerald-400/90',
  'absolute top-2 end-8 size-2 rounded-sm bg-orange-400/90',
]

export function PromoCard({ title, subtitle, href }: PromoCardData) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden rounded-xl bg-[#0d0d1a] p-4 no-underline transition-transform hover:-translate-y-0.5"
    >
      {confettiSquares.map((cls, i) => (
        <span key={i} aria-hidden className={cls} />
      ))}
      <span className="flex items-center gap-1 text-sm font-semibold text-white">
        {title}
        <ArrowUpRight className="size-3.5" />
      </span>
      <span className="mt-1 block text-xs text-white/50">{subtitle}</span>
    </Link>
  )
}
