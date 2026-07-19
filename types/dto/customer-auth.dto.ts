import { z } from 'zod'

export const CustomerLoginRequestSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(8).max(128),
})
export type CustomerLoginRequest = z.infer<typeof CustomerLoginRequestSchema>

export const CustomerRegisterEmailSchema = z.object({
  method: z.literal('email'),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  email: z.string().email().max(180),
  password: z.string().min(8).max(128),
  password_confirmation: z.string().min(8).max(128),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'passwords_do_not_match',
  path: ['password_confirmation'],
})
export type CustomerRegisterEmailRequest = z.infer<typeof CustomerRegisterEmailSchema>

export const CustomerRegisterPhoneSchema = z.object({
  method: z.literal('phone'),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  password: z.string().min(8).max(128),
  password_confirmation: z.string().min(8).max(128),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'passwords_do_not_match',
  path: ['password_confirmation'],
})
export type CustomerRegisterPhoneRequest = z.infer<typeof CustomerRegisterPhoneSchema>

export const CustomerSchema = z.object({
  ulid: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email_verified: z.boolean().optional(),
  phone_verified: z.boolean().optional(),
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
