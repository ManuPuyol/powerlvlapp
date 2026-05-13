import { createClient } from '@/lib/supabase/server'

/**
 * Crea un contrato entre un usuario y un trainer
 * Verifica que no exista ya uno activo o pendiente entre ellos
 */
export async function createContract(clientId: string, trainerId: string) {
  const supabase = await createClient()

  // Verificar que no exista un contrato activo o pendiente
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

  // Crear el contrato
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

export async function getContractsByTrainer(trainerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contracts')
    .select('*, client:profiles!client_id(full_name, avatar_url)')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getContractsByClient(clientId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('contracts')
        .select('*, trainer:profiles!trainer_id(full_name, avatar_url, username)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function updateContractStatus(contractId: string, status: string) {
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
