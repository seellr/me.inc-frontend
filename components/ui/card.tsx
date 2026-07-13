import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-xl bg-card text-card-foreground", {
  variants: {
    variant: {
      /** Resting shadow, gentle lift on hover — product/feature cards */
      interactive: "p-card shadow-ambient ring-1 ring-border transition-shadow hover:shadow-md",
      /** Static, no hover affordance — info/summary cards */
      static: "p-card shadow-ambient ring-1 ring-border",
      /** Dark, high-contrast — order summary, CTA cards */
      dark: "bg-foreground p-card text-background",
    },
  },
  defaultVariants: {
    variant: "static",
  },
})

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />
}

export { Card, cardVariants }
