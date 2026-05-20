'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/services/auth.service'
import { createContract, updateContractStatus, type ContractStatus } from '@/services/contracts.service'
import { safeAction } from '@/lib/utils/action-result'

export async function hireTrainerAction(trainerId: string) {
  return safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    if (user.id === trainerId) throw new Error('You cannot hire yourself')

    await createContract(user.id, trainerId)
    revalidatePath('/dashboard')
  })
}

export async function respondContractAction(contractId: string, status: ContractStatus) {
  return safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    await updateContractStatus(contractId, status)
    revalidatePath('/dashboard')
  })
}
