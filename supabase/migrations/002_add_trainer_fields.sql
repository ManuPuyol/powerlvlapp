-- Migration 002: Add Trainer Fields and Update RLS
-- Fecha: 2024-01-15
-- Descripción: Añade campos para trainers, visibilidad de perfiles, y actualiza políticas RLS

-- ============================================================================
-- PASO 1: AÑADIR CAMPOS DE CONTROL DE USUARIO
-- ============================================================================

alter table profiles 
  add column if not exists is_trainer boolean default false,
  add column if not exists is_being_trained boolean default false;

-- EXPLICACIÓN:
-- is_trainer: Indica si el usuario puede ofrecer servicios como trainer
-- is_being_trained: Indica si el usuario tiene contrato(s) activo(s) como cliente
-- Ambos pueden ser true (trainer que también es cliente de otro)

-- ============================================================================
-- PASO 2: AÑADIR CAMPOS ESPECÍFICOS DE TRAINER
-- ============================================================================

alter table profiles
  add column if not exists bio text,
  add column if not exists specialties text[],
  add column if not exists price_per_session numeric;

-- EXPLICACIÓN:
-- bio: Descripción del trainer (máx 500 caracteres, validado en frontend)
-- specialties: Array de especialidades ['gym', 'yoga', 'nutrition']
-- price_per_session: Precio por sesión (validar > 0 en frontend)

-- ============================================================================
-- PASO 3: AÑADIR CAMPOS DE DISPONIBILIDAD Y VISIBILIDAD
-- ============================================================================

alter table profiles
  add column if not exists is_available boolean default true,
  add column if not exists profile_visibility text default 'public';

-- EXPLICACIÓN:
-- is_available: Trainer disponible para aceptar nuevos clientes
-- profile_visibility: 'public', 'private', o 'connections' (futuro)

-- ============================================================================
-- PASO 4: AÑADIR CAMPO DE AUDITORÍA
-- ============================================================================

alter table profiles
  add column if not exists updated_at timestamptz default now();

-- ============================================================================
-- PASO 5: CREAR FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ============================================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================================
-- PASO 6: CREAR TRIGGER PARA updated_at
-- ============================================================================

drop trigger if exists update_profiles_updated_at on profiles;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- ============================================================================
-- PASO 7: ELIMINAR POLÍTICAS RLS ANTIGUAS
-- ============================================================================

drop policy if exists "Users can view their own profile" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;

-- ============================================================================
-- PASO 8: CREAR NUEVAS POLÍTICAS RLS
-- ============================================================================

-- Política: Perfiles públicos visibles para todos, privados solo para el dueño
create policy "Public profiles are viewable by everyone"
  on profiles
  for select
  using (
    profile_visibility = 'public' 
    or auth.uid() = id
  );

-- Política: Usuarios pueden actualizar su propio perfil
create policy "Users can update own profile"
  on profiles
  for update
  using (auth.uid() = id);

-- Política: Usuarios pueden insertar su propio perfil (mantener para el trigger)
create policy "Users can insert their own profile"
  on profiles
  for insert
  with check (auth.uid() = id);

-- ============================================================================
-- PASO 9 (OPCIONAL): MIGRAR DATOS EXISTENTES
-- ============================================================================

-- Si ya tienes usuarios con role='trainer', migrarlos:
-- update profiles set is_trainer = true where role = 'trainer';

-- Puedes eliminar el campo 'role' si ya no lo necesitas:
-- alter table profiles drop column if exists role;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Para verificar que todo funcionó:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles';

-- ============================================================================
-- NOTAS
-- ============================================================================

-- CAMBIOS PRINCIPALES:
-- 1. Modelo flexible: is_trainer + is_being_trained (ver ADR 001)
-- 2. Perfiles públicos por defecto (trainers visibles en listado)
-- 3. Campo updated_at con trigger automático
-- 4. Preparado para añadir más campos en el futuro

-- PRÓXIMOS PASOS:
-- 1. Generar tipos TypeScript: npx supabase gen types typescript
-- 2. Crear validaciones Zod en lib/validations/profile.ts
-- 3. Implementar formularios de edición de perfil
-- 4. Crear página pública de trainer: /trainers/[username]
