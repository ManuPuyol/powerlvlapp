-- Migration 003: Drop role column
-- Fecha: 2024-01-15
-- Descripción: Eliminamos el campo 'role' porque fue reemplazado por
--              is_trainer e is_being_trained (ver migración 002)

alter table profiles drop column if exists role;
