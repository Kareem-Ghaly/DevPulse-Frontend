import { z } from 'zod'

export const RegisterSchema = z.object({
  role: z.enum(['student', 'supervisor', 'committee-member']),

  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),

  research_interests: z.array(z.string()).optional().default([]),

  full_name: z.string().min(3, 'Full name is required'),
  department: z.string().min(2, 'Department is required'),
  university_id: z.string()
    .max(5, 'University ID cannot exceed 5 characters')
    .regex(/^[^0-9]*$/, 'University ID cannot contain numbers')
    .optional(),
  academic_year: z.string().optional(),
  academic_title: z.string().optional(),
  specialization: z.string().optional(),
  office_hours: z.string().optional(),

    skills: z.array(z.string()).optional(),  github_link: z.string()
    .url('Invalid URL format')
    .regex(/^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/, 'Must be a valid GitHub profile link')
    .or(z.literal(''))
    .optional(),
  bio: z.string().min(10, 'Bio should be at least 10 characters long').optional()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

export type AuthRegisterInput = z.infer<typeof RegisterSchema>