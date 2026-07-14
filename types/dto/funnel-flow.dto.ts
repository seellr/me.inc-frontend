import { z } from 'zod'

export const FunnelNextStepSchema = z.object({
  step: z.string(),
  order_ulid: z.string(),
  product: z.object({
    ulid: z.string(),
    name: z.string(),
    hero_image_url: z.string().nullable(),
  }).nullable(),
  price: z.union([z.string(), z.number()]).nullable(),
  original_price: z.union([z.string(), z.number()]).nullable(),
  timer_minutes: z.number().nullable(),
  headline: z.string().nullable(),
})
export type FunnelNextStep = z.infer<typeof FunnelNextStepSchema>
