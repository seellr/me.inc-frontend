import { cn } from "@/lib/utils"

/** Centered max-width wrapper with responsive horizontal padding. Wrap every section's content in this. */
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="container" className={cn("section-container", className)} {...props} />
}

export { Container }
