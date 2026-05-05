import { z } from 'zod'

export const onboardingSchema = z.object({
  isTrainer: z.enum(['true', 'false']).transform(val => val === 'true'),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

export const baseProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers and hyphens'),
})

export const trainerProfileSchema = baseProfileSchema.extend({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  specialties: z.array(z.string()).optional(),
  pricePerSession: z.coerce.number().positive('Price must be positive').optional(),
  isAvailable: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
})

export type BaseProfileInput = z.infer<typeof baseProfileSchema>
export type TrainerProfileInput = z.infer<typeof trainerProfileSchema>
