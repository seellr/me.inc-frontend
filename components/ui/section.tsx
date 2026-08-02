import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva("w-full py-section-sm lg:py-section", {
  variants: {
    surface: {
      default: "",
      tint: "section-tint",
      "tint-cool": "section-tint-cool",
      contrast: "section-contrast",
    },
    spacing: {
      default: "",
      lg: "py-section! lg:py-section-lg!",
      none: "py-0!",
    },
  },
  defaultVariants: {
    surface: "default",
    spacing: "default",
  },
})

/** Standardizes the vertical spacing rhythm between page sections. Use `surface` for tinted/contrast moments. */
function Section({
  className,
  surface,
  spacing,
  as = "section",
  ...props
}: React.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants> & { as?: "section" | "div" }) {
  const cls = cn(sectionVariants({ surface, spacing }), className)
  return as === "div" ? (
    <div data-slot="section" className={cls} {...(props as React.ComponentProps<"div">)} />
  ) : (
    <section data-slot="section" className={cls} {...props} />
  )
}

export { Section }
