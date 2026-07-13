"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function UpperBanner() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="w-full bg-primary text-primary-foreground z-10 h-8 flex items-center justify-between px-4 relative">
            <div className="flex-grow flex items-center justify-center text-xs md:text-sm font-medium overflow-hidden">
                <span className="truncate">Introducing The Current — conversations with the people building the future of work.</span>
                <span className="mx-2 opacity-50">|</span>
                <a className="hover:underline flex items-center shrink-0" href="/watch">
                    Watch now →
                </a>
            </div>
            <button 
                onClick={() => setIsVisible(false)} 
                className="absolute right-4 p-1 rounded hover:bg-primary-foreground/10 transition-colors"
                aria-label="Close banner"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}