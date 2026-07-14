import { z } from 'zod'

export const CustomerLoginRequestSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(8).max(128),
})
export type CustomerLoginRequest = z.infer<typeof CustomerLoginRequestSchema>

export const CustomerRegisterRequestSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  email: z.string().email().max(180),
  password: z.string().min(8).max(128),
  password_confirmation: z.string().min(8).max(128),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'passwords_do_not_match',
  path: ['password_confirmation'],
})
export type CustomerRegisterRequest = z.infer<typeof CustomerRegisterRequestSchema>

export const CustomerSchema = z.object({
  ulid: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string(),
  email_verified: z.boolean(),
  buyer_type: z.number().nullable().optional(),
  geo_country: z.string().nullable().optional(),
  roles: z.array(z.string()),
  created_at: z.string().nullable().optional(),
})
export type Customer = z.infer<typeof CustomerSchema>

export const CustomerLoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  user: CustomerSchema,
})
export type CustomerLoginResponse = z.infer<typeof CustomerLoginResponseSchema>
