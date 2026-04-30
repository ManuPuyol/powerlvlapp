import { z } from 'zod'

export const onboardingSchema = z.object({
  isTrainer: z.enum(['true', 'false']).transform(val => val === 'true'),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
