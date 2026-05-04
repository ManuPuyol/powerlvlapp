import { createClient } from '@/lib/supabase/server'

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
