-- Seed: Datos de prueba para desarrollo
-- Ejecutar en Supabase SQL Editor

-- ============================================================================
-- ACTUALIZAR USUARIO EXISTENTE COMO TRAINER
-- ============================================================================

UPDATE profiles SET
  username = 'manuelpuyol',
  is_trainer = true,
  is_available = true,
  onboarding_completed = true,
  bio = 'Personal trainer con más de 8 años de experiencia en fitness y nutrición deportiva. Especializado en transformación corporal y rendimiento atlético.',
  specialties = ARRAY['gym', 'nutrition', 'crossfit'],
  price_per_session = 45.00
WHERE id = '64656cd3-2aad-406e-b76e-106896171879';

-- ============================================================================
-- TRAINERS DE PRUEBA ADICIONALES
-- Para usarlos necesitas crear primero los usuarios en Auth
-- y reemplazar los UUIDs de ejemplo con los reales
-- ============================================================================

-- Trainer 2 (reemplaza el UUID con uno real)
-- INSERT INTO profiles (id, full_name, username, is_trainer, is_available, onboarding_completed, bio, specialties, price_per_session)
-- VALUES (
--   'UUID-AQUI',
--   'Sara García',
--   'saragarcia',
--   true,
--   true,
--   true,
--   'Especialista en yoga y pilates con certificación internacional. Ayudo a mis clientes a encontrar el equilibrio entre cuerpo y mente.',
--   ARRAY['yoga', 'pilates'],
--   35.00
-- );

-- Trainer 3 (reemplaza el UUID con uno real)
-- INSERT INTO profiles (id, full_name, username, is_trainer, is_available, onboarding_completed, bio, specialties, price_per_session)
-- VALUES (
--   'UUID-AQUI',
--   'Carlos Ruiz',
--   'carlosruiz',
--   true,
--   true,
--   true,
--   'Exatleta profesional reconvertido en coach. Especializado en running y preparación para competiciones.',
--   ARRAY['running', 'crossfit', 'gym'],
--   50.00
-- );
