import { createClient } from '@/lib/supabase/server'

export type ContractStatus = 'pending' | 'active' | 'rejected' | 'cancelled' | 'completed'

export type ContractWithClient = {
  id: string
  client_id: string | null
  trainer_id: string | null
  status: ContractStatus
  created_at: string | null
  updated_at: string | null
  client: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export type ContractWithTrainer = {
  id: string
  client_id: string | null
  trainer_id: string | null
  status: ContractStatus
  created_at: string | null
  updated_at: string | null
  trainer: {
    full_name: string | null
    avatar_url: string | null
    username: string | null
  } | null
}

/**
 * Crea un contrato entre un usuario y un trainer
 */
export async function createContract(clientId: string, trainerId: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('contracts')
    .select('id')
    .eq('client_id', clientId)
    .eq('trainer_id', trainerId)
    .in('status', ['pending', 'active'])
    .single()

  if (existing) {
    throw new Error('You already have an active or pending contract with this trainer')
  }

  const { data, error } = await supabase
    .from('contracts')
    .insert({
      client_id: clientId,
      trainer_id: trainerId,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getContractsByTrainer(trainerId: string): Promise<ContractWithClient[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contracts')
    .select('*, client:profiles!client_id(full_name, avatar_url)')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ContractWithClient[]
}

export async function getContractsByClient(clientId: string): Promise<ContractWithTrainer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contracts')
    .select('*, trainer:profiles!trainer_id(full_name, avatar_url, username)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ContractWithTrainer[]
}

export async function updateContractStatus(contractId: string, status: ContractStatus) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contracts')
    .update({ status })
    .eq('id', contractId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Obtiene el contrato entre un usuario y un trainer (si existe)
 */
export async function getContractBetween(clientId: string, trainerId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('contracts')
    .select('id, status')
    .eq('client_id', clientId)
    .eq('trainer_id', trainerId)
    .in('status', ['pending', 'active'])
    .single()

  return data
}

/**
 * Helpers para filtrar contratos por estado
 */
export function filterByStatus<T extends { status: ContractStatus }>(
  contracts: T[],
  status: ContractStatus
): T[] {
  return contracts.filter(c => c.status === status)
}

/**
 * Cuenta contratos activos para un trainer (helper para suspense streams)
 */
export async function countActiveClientsForTrainer(trainerId: string): Promise<number> {
  const contracts = await getContractsByTrainer(trainerId).catch(() => [])
  return filterByStatus(contracts, 'active').length
}

/**
 * Cuenta contratos activos para un cliente
 */
export async function countActiveTrainersForClient(clientId: string): Promise<number> {
  const contracts = await getContractsByClient(clientId).catch(() => [])
  return filterByStatus(contracts, 'active').length
}
