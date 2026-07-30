import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const AdminLoginSchema = z.object({
  login: z.string().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>