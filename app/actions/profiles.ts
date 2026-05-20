'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  onboardingSchema,
  baseProfileSchema,
  trainerProfileSchema,
  visibilitySchema,
} from '@/lib/validations/profile'
import { completeOnboarding, updateProfile } from '@/services/profile.service'
import { uploadAvatar } from '@/services/storage.service'
import { getCurrentUser } from '@/services/auth.service'
import { safeAction, type ActionResult } from '@/lib/utils/action-result'

export async function onboardingAction(formData: FormData) {
  const result = await safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const validated = onboardingSchema.parse({
      isTrainer: formData.get('isTrainer') as string,
    })
    await completeOnboarding(user.id, validated.isTrainer)
  })

  if (result.error) return result
  redirect('/dashboard')
}

export async function updateProfileAction(_prevState: ActionResult, formData: FormData) {
  return safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const isTrainer = formData.get('isTrainer') === 'true'

    if (isTrainer) {
      const specialtiesRaw = formData.get('specialties') as string
      const specialties = specialtiesRaw
        ? specialtiesRaw.split(',').map(s => s.trim()).filter(Boolean)
        : []

      const validated = trainerProfileSchema.parse({
        fullName: formData.get('fullName') as string,
        username: formData.get('username') as string,
        bio: formData.get('bio') as string,
        specialties,
        pricePerSession: formData.get('pricePerSession') as string,
        isAvailable: formData.get('isAvailable') === 'true' ? 'true' : 'false',
      })

      await updateProfile(user.id, {
        full_name: validated.fullName,
        username: validated.username,
        bio: validated.bio,
        specialties: validated.specialties,
        price_per_session: validated.pricePerSession,
        is_available: validated.isAvailable,
      })
    } else {
      const validated = baseProfileSchema.parse({
        fullName: formData.get('fullName') as string,
        username: formData.get('username') as string,
      })

      await updateProfile(user.id, {
        full_name: validated.fullName,
        username: validated.username,
      })
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/trainers')
  })
}

export async function uploadAvatarAction(_prevState: ActionResult, formData: FormData) {
  return safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const file = formData.get('avatar') as File
    if (!file || file.size === 0) throw new Error('No file selected')

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File too large. Max 2MB')
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Use JPG, PNG or WebP')
    }

    const publicUrl = await uploadAvatar(user.id, file)
    await updateProfile(user.id, { avatar_url: publicUrl })

    revalidatePath('/dashboard/profile')
  })
}

export async function updateVisibilityAction(_prevState: ActionResult, formData: FormData) {
  return safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const validated = visibilitySchema.parse({
      visibility: formData.get('visibility') as string,
    })
    await updateProfile(user.id, { profile_visibility: validated.visibility })

    revalidatePath('/dashboard/settings')
  })
}
