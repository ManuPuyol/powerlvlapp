'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { onboardingSchema, baseProfileSchema, trainerProfileSchema, visibilitySchema } from '@/lib/validations/profile'
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

export async function uploadAvatarAction(
  prevState: { error: string } | { error: null } | null,
  formData: FormData
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const file = formData.get('avatar') as File

    if (!file || file.size === 0) {
      return { error: 'No file selected' }
    }

    // Validar tamaño (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return { error: 'File too large. Max 2MB' }
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file type. Use JPG, PNG or WebP' }
    }

    // Subir imagen
    const { uploadAvatar } = await import('@/services/storage.service')
    const publicUrl = await uploadAvatar(user.id, file)

    // Actualizar perfil con la URL
    await updateProfile(user.id, { avatar_url: publicUrl })

    revalidatePath('/dashboard/profile')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  return { error: null }
}

export async function updateVisibilityAction(
  prevState: { error: string } | { error: null } | null,
  formData: FormData
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const rawData = {
      visibility: formData.get('visibility') as string,
    }

    const validated = visibilitySchema.parse(rawData)
    await updateProfile(user.id, { profile_visibility: validated.visibility })

    revalidatePath('/dashboard/settings')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  return { error: null }
}
