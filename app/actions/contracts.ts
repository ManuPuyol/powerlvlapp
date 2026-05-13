'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/services/auth.service'
import { createContract, updateContractStatus } from '@/services/contracts.service'

export async function hireTrainerAction(trainerId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    if (user.id === trainerId) {
      return { error: 'You cannot hire yourself' }
    }

    await createContract(user.id, trainerId)
    revalidatePath('/dashboard')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  return { error: null }
}

export async function respondContractAction(contractId: string, status: 'active' | 'rejected') {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    await updateContractStatus(contractId, status)
    revalidatePath('/dashboard')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred' }
  }

  return { error: null }
}
