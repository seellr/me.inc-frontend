import { Link } from '@/i18n/navigation'
import { gradientClass, type LinkItem } from './nav-data'

export function LinkRow({ title, subtitle, href, icon }: LinkItem) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg px-2 py-2 no-underline transition-colors hover:bg-muted"
    >
      <span className={`mt-0.5 size-8 shrink-0 rounded-md ${gradientClass[icon]}`} aria-hidden />
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </Link>
  )
}
