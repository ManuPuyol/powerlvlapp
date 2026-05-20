'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import { login, signup, logout } from '@/services/auth.service'
import { safeAction, type ActionResult } from '@/lib/utils/action-result'

export async function loginAction(_prevState: ActionResult, formData: FormData) {
  const result = await safeAction(async () => {
    const validated = loginSchema.parse({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    await login(validated.email, validated.password)
    revalidatePath('/', 'layout')
  })

  if (result.error) return result
  redirect('/dashboard')
}

export async function signupAction(_prevState: ActionResult, formData: FormData) {
  const result = await safeAction(async () => {
    const validated = signupSchema.parse({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
    })
    await signup(validated.email, validated.password, validated.fullName)
    revalidatePath('/', 'layout')
  })

  if (result.error) return result
  redirect('/onboarding')
}

export async function logoutAction() {
  const result = await safeAction(async () => {
    await logout()
    revalidatePath('/', 'layout')
  })

  if (result.error) return result
  redirect('/login')
}
