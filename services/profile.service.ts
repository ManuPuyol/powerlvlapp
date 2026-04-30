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
