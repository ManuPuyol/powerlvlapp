/**
 * Biblioteca de ejercicios comunes para autocompletado
 */

export type ExerciseTemplate = {
  name: string
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio' | 'fullbody'
  muscleGroups: string[]
}

export const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  // Chest
  { name: 'Bench Press', category: 'chest', muscleGroups: ['chest', 'triceps'] },
  { name: 'Incline Bench Press', category: 'chest', muscleGroups: ['upper chest', 'shoulders'] },
  { name: 'Dumbbell Press', category: 'chest', muscleGroups: ['chest', 'triceps'] },
  { name: 'Dumbbell Fly', category: 'chest', muscleGroups: ['chest'] },
  { name: 'Cable Crossover', category: 'chest', muscleGroups: ['chest'] },
  { name: 'Push Up', category: 'chest', muscleGroups: ['chest', 'triceps', 'core'] },
  { name: 'Dips', category: 'chest', muscleGroups: ['chest', 'triceps'] },

  // Back
  { name: 'Pull Up', category: 'back', muscleGroups: ['back', 'biceps'] },
  { name: 'Lat Pulldown', category: 'back', muscleGroups: ['back', 'biceps'] },
  { name: 'Barbell Row', category: 'back', muscleGroups: ['back', 'biceps'] },
  { name: 'Dumbbell Row', category: 'back', muscleGroups: ['back', 'biceps'] },
  { name: 'Seated Cable Row', category: 'back', muscleGroups: ['back'] },
  { name: 'T-Bar Row', category: 'back', muscleGroups: ['back'] },
  { name: 'Deadlift', category: 'back', muscleGroups: ['back', 'glutes', 'hamstrings'] },
  { name: 'Face Pull', category: 'back', muscleGroups: ['rear delts', 'back'] },

  // Legs
  { name: 'Squat', category: 'legs', muscleGroups: ['quads', 'glutes'] },
  { name: 'Front Squat', category: 'legs', muscleGroups: ['quads', 'core'] },
  { name: 'Romanian Deadlift', category: 'legs', muscleGroups: ['hamstrings', 'glutes'] },
  { name: 'Leg Press', category: 'legs', muscleGroups: ['quads', 'glutes'] },
  { name: 'Leg Extension', category: 'legs', muscleGroups: ['quads'] },
  { name: 'Leg Curl', category: 'legs', muscleGroups: ['hamstrings'] },
  { name: 'Bulgarian Split Squat', category: 'legs', muscleGroups: ['quads', 'glutes'] },
  { name: 'Lunges', category: 'legs', muscleGroups: ['quads', 'glutes'] },
  { name: 'Calf Raise', category: 'legs', muscleGroups: ['calves'] },
  { name: 'Hip Thrust', category: 'legs', muscleGroups: ['glutes'] },

  // Shoulders
  { name: 'Overhead Press', category: 'shoulders', muscleGroups: ['shoulders', 'triceps'] },
  { name: 'Dumbbell Shoulder Press', category: 'shoulders', muscleGroups: ['shoulders'] },
  { name: 'Lateral Raise', category: 'shoulders', muscleGroups: ['side delts'] },
  { name: 'Front Raise', category: 'shoulders', muscleGroups: ['front delts'] },
  { name: 'Reverse Fly', category: 'shoulders', muscleGroups: ['rear delts'] },
  { name: 'Arnold Press', category: 'shoulders', muscleGroups: ['shoulders'] },
  { name: 'Upright Row', category: 'shoulders', muscleGroups: ['shoulders', 'traps'] },

  // Arms
  { name: 'Barbell Curl', category: 'arms', muscleGroups: ['biceps'] },
  { name: 'Dumbbell Curl', category: 'arms', muscleGroups: ['biceps'] },
  { name: 'Hammer Curl', category: 'arms', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Preacher Curl', category: 'arms', muscleGroups: ['biceps'] },
  { name: 'Tricep Pushdown', category: 'arms', muscleGroups: ['triceps'] },
  { name: 'Skull Crusher', category: 'arms', muscleGroups: ['triceps'] },
  { name: 'Overhead Tricep Extension', category: 'arms', muscleGroups: ['triceps'] },
  { name: 'Close-Grip Bench Press', category: 'arms', muscleGroups: ['triceps', 'chest'] },

  // Core
  { name: 'Plank', category: 'core', muscleGroups: ['core'] },
  { name: 'Russian Twist', category: 'core', muscleGroups: ['obliques', 'core'] },
  { name: 'Hanging Leg Raise', category: 'core', muscleGroups: ['lower abs'] },
  { name: 'Cable Crunch', category: 'core', muscleGroups: ['abs'] },
  { name: 'Ab Wheel', category: 'core', muscleGroups: ['core'] },
  { name: 'Mountain Climbers', category: 'core', muscleGroups: ['core', 'cardio'] },

  // Cardio
  { name: 'Treadmill Run', category: 'cardio', muscleGroups: ['cardio'] },
  { name: 'Stationary Bike', category: 'cardio', muscleGroups: ['cardio'] },
  { name: 'Rowing Machine', category: 'cardio', muscleGroups: ['cardio', 'back'] },
  { name: 'Jump Rope', category: 'cardio', muscleGroups: ['cardio'] },
  { name: 'Burpees', category: 'cardio', muscleGroups: ['cardio', 'fullbody'] },
]

export const EXERCISE_CATEGORIES = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
  { id: 'cardio', label: 'Cardio' },
] as const

export const PLAN_GOALS = [
  { id: 'hypertrophy', label: 'Hypertrophy', color: 'text-primary' },
  { id: 'strength', label: 'Strength', color: 'text-blue-500' },
  { id: 'endurance', label: 'Endurance', color: 'text-orange-500' },
  { id: 'fatloss', label: 'Fat Loss', color: 'text-rose-500' },
  { id: 'general', label: 'General Fitness', color: 'text-muted-foreground' },
] as const

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', dots: 1 },
  { id: 'intermediate', label: 'Intermediate', dots: 2 },
  { id: 'advanced', label: 'Advanced', dots: 3 },
] as const

export type PlanGoal = typeof PLAN_GOALS[number]['id']
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]['id']
