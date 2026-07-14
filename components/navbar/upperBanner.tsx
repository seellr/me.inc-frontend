"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export function UpperBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const t = useTranslations("nav.banner")

    if (!isVisible) return null

    return (
        <Link
            href="/products"
            className="w-full bg-primary text-primary-foreground z-10 h-8 flex items-center justify-between px-4 relative transition-[filter] duration-200"
        >
            <div className="flex-grow flex items-center justify-center text-xs md:text-sm font-medium overflow-hidden gap-2">
                <span className="truncate">{t("text")}</span>
                <span className="shrink-0 opacity-75">{t("cta")}</span>
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    setIsVisible(false)
                }}
                className="absolute right-4 p-1 rounded hover:bg-primary-foreground/10 transition-colors"
                aria-label={t("close")}
            >
                <X className="h-4 w-4" />
            </button>
        </Link>
    )
}