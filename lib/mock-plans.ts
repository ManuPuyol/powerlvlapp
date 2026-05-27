/**
 * MOCK DATA TEMPORAL - eliminar cuando conectemos con Supabase
 */
import type { PlanGoal, DifficultyLevel } from '@/lib/exercise-library'

export type MockExercise = {
  id: string
  name: string
  category?: string
  sets: number
  reps: string
  rest: number
  tempo: string
  rpe: string
  notes: string
  media: { type: 'image' | 'video'; url: string }[]
}

export type MockDay = {
  id: string
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  name: string
  exercises: MockExercise[]
}

export type MockPlan = {
  id: string
  name: string
  description: string
  is_template: boolean
  goal: PlanGoal
  difficulty: DifficultyLevel
  weeks: number
  updated_at: string
  assigned_to: { full_name: string; username: string; avatar_url: string | null } | null
  days: MockDay[]
}

export const MOCK_PLANS: MockPlan[] = [
  {
    id: '1',
    name: 'Hypertrophy 4 days',
    description: 'PPL split for intermediate lifters focused on muscle growth',
    is_template: true,
    goal: 'hypertrophy',
    difficulty: 'intermediate',
    weeks: 8,
    updated_at: '2 days ago',
    assigned_to: null,
    days: [
      {
        id: 'd1', day: 'monday', name: 'Push',
        exercises: [
          { id: 'e1', name: 'Bench Press', category: 'chest', sets: 4, reps: '6-8', rest: 120, tempo: '3-1-1', rpe: '8', notes: 'Focus on controlled descent', media: [] },
          { id: 'e2', name: 'Incline Dumbbell Press', category: 'chest', sets: 3, reps: '8-10', rest: 90, tempo: '', rpe: '7-8', notes: '', media: [] },
          { id: 'e3', name: 'Overhead Press', category: 'shoulders', sets: 3, reps: '6-8', rest: 120, tempo: '', rpe: '8', notes: '', media: [] },
          { id: 'e4', name: 'Lateral Raise', category: 'shoulders', sets: 3, reps: '12-15', rest: 60, tempo: '', rpe: '', notes: 'Slow eccentric', media: [] },
          { id: 'e5', name: 'Tricep Pushdown', category: 'arms', sets: 3, reps: '10-12', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
        ]
      },
      {
        id: 'd2', day: 'tuesday', name: 'Pull',
        exercises: [
          { id: 'e6', name: 'Pull Up', category: 'back', sets: 4, reps: '6-10', rest: 120, tempo: '', rpe: '8-9', notes: 'Add weight if possible', media: [] },
          { id: 'e7', name: 'Barbell Row', category: 'back', sets: 4, reps: '8-10', rest: 90, tempo: '', rpe: '8', notes: '', media: [] },
          { id: 'e8', name: 'Lat Pulldown', category: 'back', sets: 3, reps: '10-12', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
          { id: 'e9', name: 'Barbell Curl', category: 'arms', sets: 3, reps: '8-10', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
          { id: 'e10', name: 'Hammer Curl', category: 'arms', sets: 3, reps: '10-12', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
        ]
      },
      {
        id: 'd3', day: 'thursday', name: 'Legs',
        exercises: [
          { id: 'e11', name: 'Squat', category: 'legs', sets: 4, reps: '6-8', rest: 180, tempo: '3-1-1', rpe: '8', notes: 'Full depth, brace core', media: [] },
          { id: 'e12', name: 'Romanian Deadlift', category: 'legs', sets: 3, reps: '8-10', rest: 120, tempo: '', rpe: '8', notes: '', media: [] },
          { id: 'e13', name: 'Leg Press', category: 'legs', sets: 3, reps: '10-12', rest: 90, tempo: '', rpe: '', notes: '', media: [] },
          { id: 'e14', name: 'Leg Curl', category: 'legs', sets: 3, reps: '12-15', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
          { id: 'e15', name: 'Calf Raise', category: 'legs', sets: 4, reps: '12-15', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
        ]
      },
      {
        id: 'd4', day: 'friday', name: 'Upper',
        exercises: [
          { id: 'e16', name: 'Dumbbell Press', category: 'chest', sets: 4, reps: '8-10', rest: 90, tempo: '', rpe: '8', notes: '', media: [] },
          { id: 'e17', name: 'Dumbbell Row', category: 'back', sets: 4, reps: '8-10', rest: 90, tempo: '', rpe: '', notes: '', media: [] },
          { id: 'e18', name: 'Arnold Press', category: 'shoulders', sets: 3, reps: '10-12', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
          { id: 'e19', name: 'Face Pull', category: 'back', sets: 3, reps: '12-15', rest: 60, tempo: '', rpe: '', notes: '', media: [] },
        ]
      },
    ]
  },
  {
    id: '2',
    name: 'Beginner Strength',
    description: 'Full body 3 days a week, focus on compound lifts',
    is_template: true,
    goal: 'strength',
    difficulty: 'beginner',
    weeks: 12,
    updated_at: '1 week ago',
    assigned_to: null,
    days: [],
  },
  {
    id: '3',
    name: 'Fat Loss Circuit',
    description: 'High intensity circuit training for fat loss',
    is_template: true,
    goal: 'fatloss',
    difficulty: 'intermediate',
    weeks: 6,
    updated_at: '3 weeks ago',
    assigned_to: null,
    days: [],
  },
  {
    id: '4',
    name: 'Carlos custom plan',
    description: 'Personalized leg-focused routine',
    is_template: false,
    goal: 'hypertrophy',
    difficulty: 'advanced',
    weeks: 8,
    updated_at: 'today',
    assigned_to: { full_name: 'Carlos Ruiz', username: 'carlosruiz', avatar_url: null },
    days: [],
  },
  {
    id: '5',
    name: 'Maria endurance',
    description: 'Marathon prep program',
    is_template: false,
    goal: 'endurance',
    difficulty: 'intermediate',
    weeks: 16,
    updated_at: 'yesterday',
    assigned_to: { full_name: 'Maria Sánchez', username: 'mariasanchez', avatar_url: null },
    days: [],
  },
]

export function getMockPlan(id: string): MockPlan | undefined {
  return MOCK_PLANS.find(p => p.id === id)
}

export function getMockPlanStats(plan: MockPlan) {
  const exercisesCount = plan.days.reduce((acc, d) => acc + d.exercises.length, 0)
  const totalSets = plan.days.reduce(
    (acc, d) => acc + d.exercises.reduce((s, e) => s + e.sets, 0),
    0
  )
  const estimatedTime = plan.days.reduce((acc, d) => {
    return acc + d.exercises.reduce(
      (s, e) => s + e.sets * 45 + (e.sets - 1) * e.rest,
      0
    )
  }, 0)

  return {
    days: plan.days.length,
    exercises: exercisesCount,
    sets: totalSets,
    avgTimePerDay: plan.days.length > 0 ? Math.round(estimatedTime / 60 / plan.days.length) : 0,
  }
}

/**
 * Mock: planes asignados al usuario actual (cliente)
 */
export type ClientPlanStatus = 'active' | 'upcoming' | 'completed' | 'paused'

export type ClientAssignedPlan = MockPlan & {
  status: ClientPlanStatus
  assigned_date: string
  trainer: { full_name: string; username: string; avatar_url: string | null }
  progress?: number // 0-100, solo si active
}

export const MOCK_CLIENT_PLANS: ClientAssignedPlan[] = [
  {
    ...MOCK_PLANS[0], // Hypertrophy 4 days
    status: 'active',
    assigned_date: '2 weeks ago',
    progress: 32,
    trainer: { full_name: 'Sara García', username: 'saragarcia', avatar_url: null },
  },
  {
    ...MOCK_PLANS[1], // Beginner Strength
    id: 'completed-1',
    status: 'completed',
    assigned_date: '3 months ago',
    progress: 100,
    trainer: { full_name: 'Sara García', username: 'saragarcia', avatar_url: null },
  },
  {
    ...MOCK_PLANS[2], // Fat Loss Circuit
    id: 'upcoming-1',
    status: 'upcoming',
    assigned_date: 'starts next week',
    trainer: { full_name: 'Carlos Ruiz', username: 'carlosruiz', avatar_url: null },
  },
]

export function getMockClientPlan(id: string): ClientAssignedPlan | undefined {
  return MOCK_CLIENT_PLANS.find(p => p.id === id)
}

/**
 * Mock: clientes activos del trainer (para asignar planes)
 */
export type MockClient = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  active_plans: number
  since: string
}

export const MOCK_CLIENTS: MockClient[] = [
  { id: 'c1', full_name: 'Carlos Ruiz', username: 'carlosruiz', avatar_url: null, active_plans: 1, since: '3 months ago' },
  { id: 'c2', full_name: 'Maria Sánchez', username: 'mariasanchez', avatar_url: null, active_plans: 1, since: '6 weeks ago' },
  { id: 'c3', full_name: 'Pedro Gómez', username: 'pedrogomez', avatar_url: null, active_plans: 0, since: '2 weeks ago' },
  { id: 'c4', full_name: 'Laura Pérez', username: 'lauraperez', avatar_url: null, active_plans: 0, since: '1 week ago' },
  { id: 'c5', full_name: 'Diego Martín', username: 'diegomartin', avatar_url: null, active_plans: 2, since: '4 months ago' },
]
