/**
 * Biblioteca de alimentos para autocompletado.
 * Los macros están expresados POR 100g (o 100ml en líquidos).
 * El builder deriva los totales según la cantidad introducida.
 *
 * ⚠️ DEUDA TÉCNICA (resolver en MVP backend de dietas):
 *
 * 1. CRUDO vs COCIDO: los valores mezclan estados sin marcarlo.
 *    - Rice / Pasta / Lentils / Chickpeas → valores COCIDOS
 *    - Oats / Whey → valores EN SECO
 *    Falta un campo `state: 'raw' | 'cooked'` o fijar una convención única
 *    ("as eaten"). Pesar 150g "de arroz" da distinto según crudo/cocido.
 *
 * 2. kcal vs macros: kcal NO siempre cuadra con (P*4 + C*4 + F*9) por fibra,
 *    agua y redondeos. Es normal en datos reales, pero si se quiere consistencia
 *    perfecta habría que derivar kcal desde los macros.
 *
 * 3. FUENTE: esta tabla está mantenida a mano (valores de referencia tipo USDA).
 *    Inviable a escala. En backend tirar de una API real (USDA FoodData Central
 *    u Open Food Facts) en vez de hardcodear.
 */

export type FoodCategory =
  | 'protein'
  | 'carbs'
  | 'fat'
  | 'vegetable'
  | 'fruit'
  | 'dairy'
  | 'drink'
  | 'other'

export type FoodTemplate = {
  name: string
  category: FoodCategory
  /** Macros por 100g/100ml */
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export const FOOD_LIBRARY: FoodTemplate[] = [
  // Protein
  { name: 'Chicken Breast', category: 'protein', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Turkey Breast', category: 'protein', kcal: 135, protein: 29, carbs: 0, fat: 1 },
  { name: 'Lean Beef', category: 'protein', kcal: 187, protein: 26, carbs: 0, fat: 9 },
  { name: 'Salmon', category: 'protein', kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Tuna (canned)', category: 'protein', kcal: 116, protein: 26, carbs: 0, fat: 1 },
  { name: 'Egg', category: 'protein', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Egg White', category: 'protein', kcal: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { name: 'Whey Protein', category: 'protein', kcal: 400, protein: 80, carbs: 8, fat: 6 },
  { name: 'Tofu', category: 'protein', kcal: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  { name: 'Shrimp', category: 'protein', kcal: 99, protein: 24, carbs: 0.2, fat: 0.3 },

  // Carbs
  { name: 'White Rice', category: 'carbs', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice', category: 'carbs', kcal: 123, protein: 2.7, carbs: 26, fat: 1 },
  { name: 'Oats', category: 'carbs', kcal: 389, protein: 17, carbs: 66, fat: 7 },
  { name: 'Pasta', category: 'carbs', kcal: 131, protein: 5, carbs: 25, fat: 1.1 },
  { name: 'Sweet Potato', category: 'carbs', kcal: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Potato', category: 'carbs', kcal: 77, protein: 2, carbs: 17, fat: 0.1 },
  { name: 'Whole Wheat Bread', category: 'carbs', kcal: 247, protein: 13, carbs: 41, fat: 3.4 },
  { name: 'Quinoa', category: 'carbs', kcal: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  { name: 'Lentils', category: 'carbs', kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: 'Chickpeas', category: 'carbs', kcal: 164, protein: 9, carbs: 27, fat: 2.6 },

  // Fat
  { name: 'Olive Oil', category: 'fat', kcal: 884, protein: 0, carbs: 0, fat: 100 },
  { name: 'Almonds', category: 'fat', kcal: 579, protein: 21, carbs: 22, fat: 50 },
  { name: 'Peanut Butter', category: 'fat', kcal: 588, protein: 25, carbs: 20, fat: 50 },
  { name: 'Avocado', category: 'fat', kcal: 160, protein: 2, carbs: 9, fat: 15 },
  { name: 'Walnuts', category: 'fat', kcal: 654, protein: 15, carbs: 14, fat: 65 },

  // Dairy
  { name: 'Greek Yogurt', category: 'dairy', kcal: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: 'Cottage Cheese', category: 'dairy', kcal: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { name: 'Milk', category: 'dairy', kcal: 42, protein: 3.4, carbs: 5, fat: 1 },
  { name: 'Cheddar Cheese', category: 'dairy', kcal: 402, protein: 25, carbs: 1.3, fat: 33 },

  // Vegetables
  { name: 'Broccoli', category: 'vegetable', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Spinach', category: 'vegetable', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Green Beans', category: 'vegetable', kcal: 31, protein: 1.8, carbs: 7, fat: 0.2 },
  { name: 'Tomato', category: 'vegetable', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: 'Mixed Salad', category: 'vegetable', kcal: 20, protein: 1.2, carbs: 3.5, fat: 0.2 },

  // Fruit
  { name: 'Banana', category: 'fruit', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Apple', category: 'fruit', kcal: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Blueberries', category: 'fruit', kcal: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { name: 'Orange', category: 'fruit', kcal: 47, protein: 0.9, carbs: 12, fat: 0.1 },

  // Drinks
  { name: 'Orange Juice', category: 'drink', kcal: 45, protein: 0.7, carbs: 10, fat: 0.2 },
  { name: 'Black Coffee', category: 'drink', kcal: 2, protein: 0.3, carbs: 0, fat: 0 },
]

export const FOOD_CATEGORIES = [
  { id: 'protein', label: 'Protein' },
  { id: 'carbs', label: 'Carbs' },
  { id: 'fat', label: 'Fat' },
  { id: 'vegetable', label: 'Vegetable' },
  { id: 'fruit', label: 'Fruit' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'drink', label: 'Drink' },
  { id: 'other', label: 'Other' },
] as const

/** Tipos de comida disponibles (equivalente a los días de la semana en rutinas) */
export const MEAL_TYPES = [
  { id: 'breakfast', label: 'BFAST', full: 'Breakfast' },
  { id: 'morning_snack', label: 'SNK1', full: 'Morning Snack' },
  { id: 'lunch', label: 'LUNCH', full: 'Lunch' },
  { id: 'afternoon_snack', label: 'SNK2', full: 'Afternoon Snack' },
  { id: 'dinner', label: 'DINNER', full: 'Dinner' },
  { id: 'pre_workout', label: 'PRE', full: 'Pre-Workout' },
  { id: 'post_workout', label: 'POST', full: 'Post-Workout' },
] as const

export const DIET_GOALS = [
  { id: 'bulk', label: 'Bulk', color: 'text-primary' },
  { id: 'cut', label: 'Cut', color: 'text-rose-500' },
  { id: 'maintenance', label: 'Maintenance', color: 'text-blue-500' },
  { id: 'recomp', label: 'Recomp', color: 'text-orange-500' },
  { id: 'general', label: 'General', color: 'text-muted-foreground' },
] as const

export const DIET_DIFFICULTY = [
  { id: 'flexible', label: 'Flexible', dots: 1 },
  { id: 'moderate', label: 'Moderate', dots: 2 },
  { id: 'strict', label: 'Strict', dots: 3 },
] as const

export type MealType = typeof MEAL_TYPES[number]['id']
export type DietGoal = typeof DIET_GOALS[number]['id']
export type DietDifficulty = typeof DIET_DIFFICULTY[number]['id']

/** Calcula los macros de un alimento según su cantidad en gramos */
export function macrosForQuantity(food: { kcal: number; protein: number; carbs: number; fat: number }, grams: number) {
  const factor = grams / 100
  return {
    kcal: Math.round(food.kcal * factor),
    protein: Math.round(food.protein * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
  }
}
