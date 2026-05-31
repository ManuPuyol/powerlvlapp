/**
 * MOCK DATA TEMPORAL - eliminar cuando conectemos con Supabase
 */
import type { DietGoal, DietDifficulty, MealType } from '@/lib/food-library'
import { macrosForQuantity } from '@/lib/food-library'

export type MockFood = {
  id: string
  name: string
  category?: string
  /** cantidad en gramos / ml */
  quantity: number
  /** macros por 100g, guardados para poder recalcular */
  kcal: number
  protein: number
  carbs: number
  fat: number
  notes: string
}

export type MockMeal = {
  id: string
  meal: MealType
  name: string
  /** hora orientativa, ej "08:00" */
  time: string
  foods: MockFood[]
}

export type MockDiet = {
  id: string
  name: string
  description: string
  is_template: boolean
  goal: DietGoal
  difficulty: DietDifficulty
  /** objetivo calórico diario de referencia */
  target_kcal: number
  updated_at: string
  assigned_to: { full_name: string; username: string; avatar_url: string | null } | null
  meals: MockMeal[]
}

export const MOCK_DIETS: MockDiet[] = [
  {
    id: '1',
    name: 'Lean Bulk 2800',
    description: 'Moderate surplus for clean muscle gain',
    is_template: true,
    goal: 'bulk',
    difficulty: 'moderate',
    target_kcal: 2800,
    updated_at: '2 days ago',
    assigned_to: null,
    meals: [
      {
        id: 'm1', meal: 'breakfast', name: 'Breakfast', time: '08:00',
        foods: [
          { id: 'f1', name: 'Oats', category: 'carbs', quantity: 80, kcal: 389, protein: 17, carbs: 66, fat: 7, notes: '' },
          { id: 'f2', name: 'Whey Protein', category: 'protein', quantity: 30, kcal: 400, protein: 80, carbs: 8, fat: 6, notes: 'Mixed with the oats' },
          { id: 'f3', name: 'Banana', category: 'fruit', quantity: 120, kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, notes: '' },
        ],
      },
      {
        id: 'm2', meal: 'lunch', name: 'Lunch', time: '14:00',
        foods: [
          { id: 'f4', name: 'Chicken Breast', category: 'protein', quantity: 200, kcal: 165, protein: 31, carbs: 0, fat: 3.6, notes: '' },
          { id: 'f5', name: 'White Rice', category: 'carbs', quantity: 150, kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, notes: 'Weighed cooked' },
          { id: 'f6', name: 'Broccoli', category: 'vegetable', quantity: 150, kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, notes: '' },
        ],
      },
      {
        id: 'm3', meal: 'dinner', name: 'Dinner', time: '21:00',
        foods: [
          { id: 'f7', name: 'Salmon', category: 'protein', quantity: 180, kcal: 208, protein: 20, carbs: 0, fat: 13, notes: '' },
          { id: 'f8', name: 'Sweet Potato', category: 'carbs', quantity: 200, kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, notes: '' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Cut 1800',
    description: 'High protein deficit for fat loss while preserving muscle',
    is_template: true,
    goal: 'cut',
    difficulty: 'strict',
    target_kcal: 1800,
    updated_at: '1 week ago',
    assigned_to: null,
    meals: [],
  },
  {
    id: '3',
    name: 'Maintenance Flexible',
    description: 'Balanced macros for maintaining current weight',
    is_template: true,
    goal: 'maintenance',
    difficulty: 'flexible',
    target_kcal: 2200,
    updated_at: '3 weeks ago',
    assigned_to: null,
    meals: [],
  },
  {
    id: '4',
    name: 'Carlos cut plan',
    description: 'Personalized aggressive cut',
    is_template: false,
    goal: 'cut',
    difficulty: 'strict',
    target_kcal: 1900,
    updated_at: 'today',
    assigned_to: { full_name: 'Carlos Ruiz', username: 'carlosruiz', avatar_url: null },
    meals: [],
  },
]

export function getMockDiet(id: string): MockDiet | undefined {
  return MOCK_DIETS.find(d => d.id === id)
}

/** Suma los macros de un alimento aplicando su cantidad */
export function foodTotals(food: MockFood) {
  return macrosForQuantity(food, food.quantity)
}

/** Suma los macros de una comida completa */
export function mealTotals(meal: MockMeal) {
  return meal.foods.reduce(
    (acc, f) => {
      const t = foodTotals(f)
      return {
        kcal: acc.kcal + t.kcal,
        protein: Math.round((acc.protein + t.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + t.carbs) * 10) / 10,
        fat: Math.round((acc.fat + t.fat) * 10) / 10,
      }
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

export function getMockDietStats(diet: MockDiet) {
  const totals = diet.meals.reduce(
    (acc, m) => {
      const t = mealTotals(m)
      return {
        kcal: acc.kcal + t.kcal,
        protein: Math.round((acc.protein + t.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + t.carbs) * 10) / 10,
        fat: Math.round((acc.fat + t.fat) * 10) / 10,
      }
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return {
    meals: diet.meals.length,
    foods: diet.meals.reduce((acc, m) => acc + m.foods.length, 0),
    ...totals,
  }
}
