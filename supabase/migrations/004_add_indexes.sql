-- Migration 004: Add performance indexes
-- Fecha: 2026-04-30
-- Descripción: Índices para optimizar queries frecuentes en profiles y contracts

-- ============================================================================
-- PROFILES
-- ============================================================================

-- Búsqueda por username (perfil público)
-- Solo indexa filas que tienen username (índice parcial - más pequeño)
CREATE INDEX IF NOT EXISTS idx_profiles_username
  ON profiles(username)
  WHERE username IS NOT NULL;

-- Listado de trainers públicos disponibles ordenados por fecha
-- Optimiza /trainers page
CREATE INDEX IF NOT EXISTS idx_profiles_trainers_public
  ON profiles(is_trainer, profile_visibility, created_at DESC)
  WHERE is_trainer = true AND profile_visibility = 'public';

-- ============================================================================
-- CONTRACTS
-- ============================================================================

-- Queries del dashboard de trainer (filtrar por trainer + status)
-- Optimiza: getContractsByTrainer(), countActiveClientsForTrainer()
CREATE INDEX IF NOT EXISTS idx_contracts_trainer_status
  ON contracts(trainer_id, status, created_at DESC);

-- Queries del cliente (filtrar por client + status)
-- Optimiza: getContractsByClient(), countActiveTrainersForClient()
CREATE INDEX IF NOT EXISTS idx_contracts_client_status
  ON contracts(client_id, status, created_at DESC);

-- Lookup específico para verificar contratos existentes entre dos usuarios
-- Optimiza: createContract() y getContractBetween()
CREATE INDEX IF NOT EXISTS idx_contracts_lookup
  ON contracts(client_id, trainer_id, status);
