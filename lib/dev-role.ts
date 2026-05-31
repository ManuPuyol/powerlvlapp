import { cookies } from 'next/headers'

/**
 * DEV ONLY: lee el override de rol de la cookie.
 * Devuelve true/false si hay override, null si no.
 * TODO: eliminar antes de producción.
 */
export async function getDevRoleOverride(): Promise<boolean | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get('dev_role_override')?.value
  if (value === 'trainer') return true
  if (value === 'user') return false
  return null
}
