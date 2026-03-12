import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind CSS de forma inteligente
 * 
 * Características:
 * - Combina clases condicionales
 * - Resuelve conflictos de Tailwind (ej: 'p-4' + 'p-2' = 'p-2')
 * - Elimina clases duplicadas
 * 
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', 'text-white')
 * // => 'px-2 py-1 bg-blue-500 text-white'
 * 
 * @example
 * cn('p-4', 'p-2') // => 'p-2' (el último gana)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
