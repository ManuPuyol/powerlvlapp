'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * DEV ONLY: alterna el rol (trainer/user) mediante una cookie local.
 * TODO: eliminar antes de producción.
 */
export async function toggleDevRole(makeTrainer: boolean) {
  const cookieStore = await cookies()
  cookieStore.set('dev_role_override', makeTrainer ? 'trainer' : 'user', {
    path: '/',
    maxAge: 60 * 60 * 24, // 1 día
  })
  revalidatePath('/', 'layout')
}
