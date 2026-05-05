'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { onboardingSchema, baseProfileSchema, trainerProfileSchema } from '@/lib/validations/profile'
import { completeOnboarding, updateProfile } from '@/services/profile.service'
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

export async function updateProfileAction(
  prevState: { error: string } | { error: null } | null,
  formData: FormData
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const isTrainer = formData.get('isTrainer') === 'true'

    if (isTrainer) {
      // Parsear specialties desde string separado por comas
      const specialtiesRaw = formData.get('specialties') as string
      const specialties = specialtiesRaw
        ? specialtiesRaw.split(',').map(s => s.trim()).filter(Boolean)
        : []

      const rawData = {
        fullName: formData.get('fullName') as string,
        username: formData.get('username') as string,
        bio: formData.get('bio') as string,
        specialties,
        pricePerSession: formData.get('pricePerSession') as string,
        isAvailable: formData.get('isAvailable') === 'true' ? 'true' : 'false',
      }

      const validated = trainerProfileSchema.parse(rawData)

      await updateProfile(user.id, {
        full_name: validated.fullName,
        username: validated.username,
        bio: validated.bio,
        specialties: validated.specialties,
        price_per_session: validated.pricePerSession,
        is_available: validated.isAvailable,
      })
    } else {
      const rawData = {
        fullName: formData.get('fullName') as string,
        username: formData.get('username') as string,
      }

      const validated = baseProfileSchema.parse(rawData)

      await updateProfile(user.id, {
        full_name: validated.fullName,
        username: validated.username,
      })
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/trainers')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  return { error: null }
}
