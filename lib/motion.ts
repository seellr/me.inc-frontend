import type { Transition, Variants } from 'framer-motion'

/** Standard "ease out expo"-ish curve used across the app. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Snappier curve for small/interactive elements (buttons, toggles). */
export const EASE_SNAPPY = [0.16, 1, 0.3, 1] as const

export const DURATION = {
  fast: 0.25,
  base: 0.55,
  slow: 0.8,
} as const

export const SPRING: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 0.9,
}

export const VIEWPORT = { once: true, margin: '-80px' } as const

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE } },
}

/** Mirrors slideInRight/Left based on writing direction (for RTL/Arabic layouts). */
export function slideInStart(dir: 'ltr' | 'rtl'): Variants {
  return dir === 'rtl' ? slideInRight : slideInLeft
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: SPRING },
}

/** Whole-page enter/exit transition, e.g. wrapped around {children} in layout. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: DURATION.fast, ease: EASE } },
}

/**
 * Strips motion (keeps only opacity) for users with prefers-reduced-motion.
 * Pass the result of Framer Motion's `useReducedMotion()` hook.
 */
export function withReducedMotion(variants: Variants, reduced: boolean | null): Variants {
  if (!reduced) return variants
  const strip = (variant: Variants[string]) => {
    if (typeof variant !== 'object' || variant === null) return variant
    const { opacity, transition } = variant as Record<string, unknown>
    return { opacity: opacity ?? 1, transition }
  }
  return Object.fromEntries(Object.entries(variants).map(([key, v]) => [key, strip(v)])) as Variants
}
