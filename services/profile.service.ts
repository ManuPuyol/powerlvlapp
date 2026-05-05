import { createClient } from '@/lib/supabase/server'
import { PG_ERROR_CODES } from '@/lib/constants'

/**
 * Completa el onboarding del usuario
 * Actualiza is_trainer y marca onboarding como completado
 */
export async function completeOnboarding(userId: string, isTrainer: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      is_trainer: isTrainer,
      onboarding_completed: true,
    })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Obtiene todos los trainers disponibles
 */
export async function getTrainers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, bio, specialties, price_per_session, is_available')
    .eq('is_trainer', true)
    .eq('profile_visibility', 'public')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Obtiene un trainer por su username
 */
export async function getTrainerByUsername(username: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, bio, specialties, price_per_session, is_available')
    .eq('username', username)
    .eq('is_trainer', true)
    .eq('profile_visibility', 'public')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, is_trainer, bio, specialties, price_per_session, is_available, updated_at')
    .eq('id', user.id)
    .single()

  if (error) return null

  return data
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(
  userId: string,
  data: {
    full_name?: string
    username?: string
    avatar_url?: string
    bio?: string
    specialties?: string[]
    price_per_session?: number
    is_available?: boolean
  }
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)

  if (error) {
    // Error de username duplicado
    if (error.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
      throw new Error('Username already taken')
    }
    throw new Error(error.message)
  }
}
