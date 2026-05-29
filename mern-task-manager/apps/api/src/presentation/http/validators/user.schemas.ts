import { z } from 'zod'

export const registerUserSchema = z.object({
  email: z.string().toLowerCase(),
  password: z.string().min(8)
})

export const updateUserSchema = z.object({
  email: z.string().toLowerCase().optional(),
  role: z.enum(['user', 'admin', 'guest']).optional()
})
