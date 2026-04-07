'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import { login, signup, logout } from '@/services/auth.service'

export async function loginAction(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validated = loginSchema.parse(rawData)
    await login(validated.email, validated.password)
    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/dashboard')
}

export async function signupAction(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
    }

    const validated = signupSchema.parse(rawData)
    await signup(validated.email, validated.password, validated.fullName)
    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  try {
    await logout()
    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  redirect('/login')
}
