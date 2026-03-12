-- Migration 001: Initial Profiles Setup
-- Fecha: 2024-01-15
-- Descripción: Configuración inicial de la tabla profiles con trigger automático y RLS

-- ============================================================================
-- 1. CREAR TABLA PROFILES
-- ============================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'client',
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- 2. HABILITAR ROW LEVEL SECURITY
-- ============================================================================

alter table profiles enable row level security;

-- ============================================================================
-- 3. POLÍTICAS RLS INICIALES
-- ============================================================================

-- Política: Los usuarios pueden insertar su propio perfil
create policy "Users can insert their own profile"
  on profiles
  for insert
  with check (auth.uid() = id);

-- Política: Los usuarios pueden ver su propio perfil
create policy "Users can view their own profile"
  on profiles
  for select
  using (auth.uid() = id);

-- ============================================================================
-- 4. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 5. TRIGGER PARA EJECUTAR LA FUNCIÓN AL REGISTRARSE
-- ============================================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ============================================================================
-- NOTAS
-- ============================================================================

-- Este setup inicial:
-- 1. Crea la tabla profiles vinculada a auth.users
-- 2. Habilita RLS para seguridad
-- 3. Permite que usuarios vean/inserten solo su propio perfil
-- 4. Crea automáticamente un perfil cuando alguien se registra
-- 5. Extrae el full_name de los metadatos del registro

-- LIMITACIONES CONOCIDAS:
-- - Las políticas RLS son muy restrictivas (solo ves tu propio perfil)
-- - Esto se arreglará en la migración 002 para perfiles públicos
-- - El campo 'role' será reemplazado por is_trainer/is_being_trained
