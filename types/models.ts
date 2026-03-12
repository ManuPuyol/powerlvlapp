import type { Database } from './database'

// Tipos de las tablas
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Tipos de dominio más específicos
export type Trainer = Profile & {
  is_trainer: true
  bio: string
  specialties: string[]
  price_per_session: number
}

export type Client = Profile & {
  is_being_trained: true
}

// Enums y constantes
export const ProfileVisibility = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  CONNECTIONS: 'connections',
} as const

export type ProfileVisibilityType = typeof ProfileVisibility[keyof typeof ProfileVisibility]

// Tipos de especialidades (puedes expandir esto)
export const Specialties = {
  GYM: 'gym',
  YOGA: 'yoga',
  CROSSFIT: 'crossfit',
  PILATES: 'pilates',
  NUTRITION: 'nutrition',
  RUNNING: 'running',
  BOXING: 'boxing',
  SWIMMING: 'swimming',
} as const

export type SpecialtyType = typeof Specialties[keyof typeof Specialties]
