import { createClient } from '@/lib/supabase/server'

/**
 * Sube un avatar y devuelve la URL pública
 */
export async function uploadAvatar(userId: string, file: File) {
  const supabase = await createClient()

  // Nombre del archivo: {userId}/avatar.{extension}
  const extension = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${extension}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true, // Sobreescribe si ya existe
    })

  if (error) {
    throw new Error(error.message)
  }

  // Obtener URL pública
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return data.publicUrl
}
