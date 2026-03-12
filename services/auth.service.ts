import { createClient } from '@/lib/supabase/server'

/**
 * Inicia sesión con email y contraseña
 */
export async function login(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Registra un nuevo usuario
 */
export async function signup(
  email: string,
  password: string,
  fullName: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // Se guarda en raw_user_meta_data
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  // Verificar que el usuario se creó
  if (!data.user) {
    throw new Error('Failed to create user')
  }

  return data
}

/**
 * Cierra la sesión del usuario actual
 */
export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Obtiene el usuario actual autenticado
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return user
}
