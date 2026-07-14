import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-micro font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        /** Dark pill used as a section eyebrow, e.g. "OUR PRODUCTS" */
        eyebrow: "bg-foreground text-background uppercase tracking-wide",
        sale: "bg-sale text-sale-foreground",
        new: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "eyebrow",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
