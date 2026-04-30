'use server'

import { redirect } from 'next/navigation'
import { onboardingSchema } from '@/lib/validations/profile'
import { completeOnboarding } from '@/services/profile.service'
import { getCurrentUser } from '@/services/auth.service'

export async function onboardingAction(formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const rawData = {
      isTrainer: formData.get('isTrainer') as string,
    }

    const validated = onboardingSchema.parse(rawData)
    await completeOnboarding(user.id, validated.isTrainer)
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/dashboard')
}
