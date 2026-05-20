import { ZodError } from 'zod'

/**
 * Tipo estándar para resultados de Server Actions.
 * Compatible con useActionState.
 */
export type ActionResult = { error: string } | { error: null } | null

/**
 * Wrapper que convierte cualquier error en un ActionResult.
 *
 * Maneja:
 * - Errores de Zod (devuelve el primer mensaje de validación)
 * - Errores genéricos de Error
 * - Cualquier otro tipo de excepción
 *
 * @example
 * export async function myAction(prev, formData) {
 *   return safeAction(async () => {
 *     const validated = mySchema.parse(...)
 *     await myService(validated)
 *   })
 * }
 */
export async function safeAction(
  fn: () => Promise<void>
): Promise<{ error: string } | { error: null }> {
  try {
    await fn()
    return { error: null }
  } catch (error) {
    return { error: extractErrorMessage(error) }
  }
}

/**
 * Extrae un mensaje de error legible de cualquier excepción.
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Validation error'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
