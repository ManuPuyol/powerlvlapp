'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FoodInput } from './food-input'
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown, Eye, Save, UtensilsCrossed,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MEAL_TYPES, DIET_GOALS, DIET_DIFFICULTY, macrosForQuantity,
  type MealType, type DietGoal, type DietDifficulty,
} from '@/lib/food-library'
import type { MockDiet } from '@/lib/mock-diets'

type Food = {
  id: string
  name: string
  category?: string
  quantity: number
  kcal: number
  protein: number
  carbs: number
  fat: number
  notes: string
}

type Meal = {
  id: string
  meal: MealType
  name: string
  time: string
  foods: Food[]
}

function uid() {
  return Math.random().toString(36).slice(2, 11)
}

function newFood(): Food {
  return {
    id: uid(),
    name: '',
    quantity: 100,
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: '',
  }
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function sumMeal(foods: Food[]) {
  return foods.reduce(
    (acc, f) => {
      const t = macrosForQuantity(f, f.quantity)
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

export function DietBuilder({ initialDiet }: { initialDiet?: MockDiet } = {}) {
  const [name, setName] = useState(initialDiet?.name ?? '')
  const [description, setDescription] = useState(initialDiet?.description ?? '')
  const [goal, setGoal] = useState<DietGoal>(initialDiet?.goal ?? 'maintenance')
  const [difficulty, setDifficulty] = useState<DietDifficulty>(initialDiet?.difficulty ?? 'moderate')
  const [targetKcal, setTargetKcal] = useState(String(initialDiet?.target_kcal ?? 2200))
  const [meals, setMeals] = useState<Meal[]>(
    initialDiet?.meals.map(m => ({
      id: m.id,
      meal: m.meal,
      name: m.name,
      time: m.time,
      foods: m.foods.map(f => ({ ...f })),
    })) ?? []
  )
  const [previewMode, setPreviewMode] = useState(false)

  const usedMeals = new Set(meals.map(m => m.meal))
  const totalFoods = meals.reduce((acc, m) => acc + m.foods.length, 0)
  const totals = meals.reduce(
    (acc, m) => {
      const t = sumMeal(m.foods)
      return {
        kcal: acc.kcal + t.kcal,
        protein: Math.round((acc.protein + t.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + t.carbs) * 10) / 10,
        fat: Math.round((acc.fat + t.fat) * 10) / 10,
      }
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const target = parseInt(targetKcal) || 0
  const kcalDiff = totals.kcal - target

  function addMeal(mealId: MealType) {
    const mealLabel = MEAL_TYPES.find(m => m.id === mealId)?.full ?? ''
    const newMeal: Meal = {
      id: uid(),
      meal: mealId,
      name: mealLabel,
      time: '',
      foods: [newFood()],
    }
    setMeals(prev => {
      const next = [...prev, newMeal]
      const order = MEAL_TYPES.map(m => m.id)
      return next.sort((a, b) => order.indexOf(a.meal) - order.indexOf(b.meal))
    })
  }

  function removeMeal(id: string) {
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  function duplicateMeal(id: string) {
    const meal = meals.find(m => m.id === id)
    if (!meal) return
    const freeMeal = MEAL_TYPES.find(m => !usedMeals.has(m.id))
    if (!freeMeal) {
      alert('All meal slots are already in use')
      return
    }
    const copy: Meal = {
      ...meal,
      id: uid(),
      meal: freeMeal.id,
      name: `${meal.name} (copy)`,
      foods: meal.foods.map(f => ({ ...f, id: uid() })),
    }
    setMeals(prev => {
      const next = [...prev, copy]
      const order = MEAL_TYPES.map(m => m.id)
      return next.sort((a, b) => order.indexOf(a.meal) - order.indexOf(b.meal))
    })
  }

  function updateMeal(id: string, patch: Partial<Meal>) {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  function addFood(mealId: string) {
    setMeals(prev => prev.map(m =>
      m.id === mealId ? { ...m, foods: [...m.foods, newFood()] } : m
    ))
  }

  function updateFood(mealId: string, foodId: string, patch: Partial<Food>) {
    setMeals(prev => prev.map(m =>
      m.id === mealId
        ? { ...m, foods: m.foods.map(f => f.id === foodId ? { ...f, ...patch } : f) }
        : m
    ))
  }

  function removeFood(mealId: string, foodId: string) {
    setMeals(prev => prev.map(m =>
      m.id === mealId
        ? { ...m, foods: m.foods.filter(f => f.id !== foodId) }
        : m
    ))
  }

  function duplicateFood(mealId: string, foodId: string) {
    setMeals(prev => prev.map(m => {
      if (m.id !== mealId) return m
      const food = m.foods.find(f => f.id === foodId)
      if (!food) return m
      const idx = m.foods.findIndex(f => f.id === foodId)
      const copy = { ...food, id: uid() }
      const foods = [...m.foods]
      foods.splice(idx + 1, 0, copy)
      return { ...m, foods }
    }))
  }

  function moveFood(mealId: string, foodId: string, direction: -1 | 1) {
    setMeals(prev => prev.map(m => {
      if (m.id !== mealId) return m
      const idx = m.foods.findIndex(f => f.id === foodId)
      return { ...m, foods: move(m.foods, idx, idx + direction) }
    }))
  }

  const goalInfo = DIET_GOALS.find(g => g.id === goal)
  const difficultyInfo = DIET_DIFFICULTY.find(d => d.id === difficulty)

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">

        {/* Diet info */}
        <div className="border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-mono-tag text-muted-foreground">DIET INFO</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="font-mono-tag text-muted-foreground">NAME</Label>
              <Input
                placeholder="Lean Bulk 2800"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono-tag text-muted-foreground">DESCRIPTION</Label>
              <Textarea
                placeholder="Brief description..."
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono-tag text-muted-foreground">GOAL</Label>
              <Select value={goal} onValueChange={v => setGoal(v as DietGoal)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIET_GOALS.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="font-mono-tag text-muted-foreground">LEVEL</Label>
                <Select value={difficulty} onValueChange={v => setDifficulty(v as DietDifficulty)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIET_DIFFICULTY.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono-tag text-muted-foreground">TARGET KCAL</Label>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  value={targetKcal}
                  onChange={e => setTargetKcal(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meal picker */}
        <div className="border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-mono-tag text-muted-foreground">MEALS</p>
            <span className="font-mono-tag text-muted-foreground">
              {String(meals.length).padStart(2, '0')}/{String(MEAL_TYPES.length).padStart(2, '0')}
            </span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-1">
              {MEAL_TYPES.map(meal => {
                const isUsed = usedMeals.has(meal.id)
                return (
                  <button
                    key={meal.id}
                    type="button"
                    disabled={isUsed}
                    onClick={() => addMeal(meal.id)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 font-mono-tag text-xs border transition-all',
                      isUsed
                        ? 'bg-primary text-primary-foreground border-primary cursor-default'
                        : 'border-border hover:border-primary hover:text-primary'
                    )}
                  >
                    <span>{meal.full.toUpperCase()}</span>
                    {isUsed ? <span>●</span> : <Plus size={12} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div className="border bg-card p-4 space-y-4">
          <p className="font-mono-tag text-muted-foreground">LIVE STATS</p>

          <div>
            <p className="text-3xl font-bold font-display tracking-tighter text-primary">
              {totals.kcal}
              <span className="text-sm text-muted-foreground ml-1">kcal</span>
            </p>
            <p className="font-mono-tag text-muted-foreground">
              TARGET {target} •{' '}
              <span className={cn(
                kcalDiff === 0
                  ? 'text-muted-foreground'
                  : Math.abs(kcalDiff) <= 100
                    ? 'text-primary'
                    : 'text-rose-500'
              )}>
                {kcalDiff > 0 ? '+' : ''}{kcalDiff}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <p className="text-lg font-bold font-display tracking-tighter">{totals.protein}g</p>
              <p className="font-mono-tag text-muted-foreground">PROTEIN</p>
            </div>
            <div>
              <p className="text-lg font-bold font-display tracking-tighter">{totals.carbs}g</p>
              <p className="font-mono-tag text-muted-foreground">CARBS</p>
            </div>
            <div>
              <p className="text-lg font-bold font-display tracking-tighter">{totals.fat}g</p>
              <p className="font-mono-tag text-muted-foreground">FAT</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div>
              <p className="text-2xl font-bold font-display tracking-tighter text-primary">
                {String(meals.length).padStart(2, '0')}
              </p>
              <p className="font-mono-tag text-muted-foreground">MEALS</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display tracking-tighter text-primary">
                {String(totalFoods).padStart(2, '0')}
              </p>
              <p className="font-mono-tag text-muted-foreground">FOODS</p>
            </div>
          </div>

          <div className="pt-3 border-t flex items-center gap-2 flex-wrap">
            <span className={cn('font-mono-tag', goalInfo?.color)}>
              {goalInfo?.label.toUpperCase()}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-mono-tag text-muted-foreground inline-flex items-center gap-1">
              {difficultyInfo?.label.toUpperCase()}
              <span className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-1 h-1 rounded-full',
                      i < (difficultyInfo?.dots ?? 0) ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                ))}
              </span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setPreviewMode(p => !p)}
          >
            <Eye size={14} className="mr-1.5" />
            {previewMode ? 'Edit mode' : 'Preview'}
          </Button>
          <Button
            className="w-full"
            size="lg"
            disabled={!name || meals.length === 0}
          >
            <Save size={14} className="mr-1.5" />
            Save diet
          </Button>
        </div>
      </aside>

      {/* Editor / Preview */}
      <div className="space-y-4 min-w-0">

        {meals.length === 0 ? (
          <div className="border border-dashed p-12 text-center space-y-4">
            <div className="inline-flex w-12 h-12 bg-muted items-center justify-center text-muted-foreground">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <p className="font-mono-tag text-muted-foreground">[ EMPTY DIET ]</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tap a meal in the sidebar to start building
              </p>
            </div>
          </div>
        ) : previewMode ? (
          <DietPreview meals={meals} name={name} description={description} totals={totals} target={target} />
        ) : (
          meals.map((meal, mealIdx) => (
            <MealCard
              key={meal.id}
              meal={meal}
              mealIdx={mealIdx}
              onUpdate={patch => updateMeal(meal.id, patch)}
              onRemove={() => removeMeal(meal.id)}
              onDuplicate={() => duplicateMeal(meal.id)}
              onAddFood={() => addFood(meal.id)}
              onUpdateFood={(foodId, patch) => updateFood(meal.id, foodId, patch)}
              onRemoveFood={foodId => removeFood(meal.id, foodId)}
              onDuplicateFood={foodId => duplicateFood(meal.id, foodId)}
              onMoveFood={(foodId, dir) => moveFood(meal.id, foodId, dir)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function MealCard({
  meal, mealIdx, onUpdate, onRemove, onDuplicate, onAddFood,
  onUpdateFood, onRemoveFood, onDuplicateFood, onMoveFood,
}: {
  meal: Meal
  mealIdx: number
  onUpdate: (patch: Partial<Meal>) => void
  onRemove: () => void
  onDuplicate: () => void
  onAddFood: () => void
  onUpdateFood: (foodId: string, patch: Partial<Food>) => void
  onRemoveFood: (foodId: string) => void
  onDuplicateFood: (foodId: string) => void
  onMoveFood: (foodId: string, dir: -1 | 1) => void
}) {
  const mealInfo = MEAL_TYPES.find(m => m.id === meal.meal)
  const totals = sumMeal(meal.foods)

  return (
    <article className="border bg-card animate-fade-in-up">

      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-12 h-12 bg-primary text-primary-foreground flex flex-col items-center justify-center font-mono-tag font-bold leading-none">
          <span className="text-[10px] opacity-70">{String(mealIdx + 1).padStart(2, '0')}</span>
          <span className="text-[9px]">{mealInfo?.label}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono-tag text-muted-foreground">
            {mealInfo?.full.toUpperCase()} • {meal.foods.length} FOODS • {totals.kcal} KCAL
          </p>
          <Input
            value={meal.name}
            onChange={e => onUpdate({ name: e.target.value })}
            className="border-0 px-0 h-auto py-1 text-lg font-bold focus-visible:ring-0"
            placeholder="Meal name"
          />
        </div>
        <Input
          value={meal.time}
          onChange={e => onUpdate({ time: e.target.value })}
          className="w-20 text-center text-sm font-mono-tag"
          placeholder="08:00"
        />
        <button
          type="button"
          onClick={onDuplicate}
          title="Duplicate meal"
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          title="Remove meal"
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="divide-y">
        {meal.foods.map((food, foodIdx) => (
          <FoodRow
            key={food.id}
            food={food}
            index={foodIdx}
            isFirst={foodIdx === 0}
            isLast={foodIdx === meal.foods.length - 1}
            onUpdate={patch => onUpdateFood(food.id, patch)}
            onRemove={() => onRemoveFood(food.id)}
            onDuplicate={() => onDuplicateFood(food.id)}
            onMove={dir => onMoveFood(food.id, dir)}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddFood}
          className="w-full"
        >
          <Plus size={14} className="mr-1" />
          Add food
        </Button>
      </div>
    </article>
  )
}

function FoodRow({
  food, index, isFirst, isLast,
  onUpdate, onRemove, onDuplicate, onMove,
}: {
  food: Food
  index: number
  isFirst: boolean
  isLast: boolean
  onUpdate: (patch: Partial<Food>) => void
  onRemove: () => void
  onDuplicate: () => void
  onMove: (dir: -1 | 1) => void
}) {
  const t = macrosForQuantity(food, food.quantity)

  return (
    <div className="p-4 group hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">

        <div className="flex flex-col gap-0.5 pt-2">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            className="w-5 h-5 flex items-center justify-center text-muted-foreground/50 hover:text-primary disabled:opacity-30"
          >
            <ChevronUp size={12} />
          </button>
          <span className="font-mono-tag text-muted-foreground text-xs text-center">
            {String(index + 1).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={isLast}
            className="w-5 h-5 flex items-center justify-center text-muted-foreground/50 hover:text-primary disabled:opacity-30"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        <div className="flex-1 min-w-0 space-y-3">

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-2">
            <FoodInput
              value={food.name}
              onChange={(name, suggestion) => {
                onUpdate({
                  name,
                  category: suggestion?.category,
                  // Si viene de la librería, guardamos macros por 100g
                  ...(suggestion && {
                    kcal: suggestion.kcal,
                    protein: suggestion.protein,
                    carbs: suggestion.carbs,
                    fat: suggestion.fat,
                  }),
                })
              }}
            />
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="5"
                value={food.quantity}
                onChange={e => onUpdate({ quantity: parseInt(e.target.value) || 0 })}
                className="text-sm pr-7"
                placeholder="100"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono-tag text-muted-foreground text-xs pointer-events-none">
                G
              </span>
            </div>
          </div>

          {/* Macros calculados (read-only) */}
          <div className="grid grid-cols-4 gap-2">
            <MacroBox label="KCAL" value={t.kcal} accent />
            <MacroBox label="PROT" value={`${t.protein}g`} />
            <MacroBox label="CARB" value={`${t.carbs}g`} />
            <MacroBox label="FAT" value={`${t.fat}g`} />
          </div>

          <Textarea
            value={food.notes}
            onChange={e => onUpdate({ notes: e.target.value })}
            placeholder="Notes for the client (preparation, substitutions, etc.)"
            rows={1}
            className="text-sm"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onDuplicate}
              className="inline-flex items-center gap-1 text-xs font-mono-tag text-muted-foreground hover:text-primary transition-colors"
            >
              <Copy size={12} /> DUPLICATE
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="ml-auto inline-flex items-center gap-1 text-xs font-mono-tag text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={12} /> REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MacroBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={cn('border px-2 py-1.5 text-center', accent && 'border-primary/40 bg-primary/5')}>
      <p className={cn('text-sm font-bold font-display tracking-tighter', accent && 'text-primary')}>
        {value}
      </p>
      <p className="font-mono-tag text-muted-foreground text-[10px]">{label}</p>
    </div>
  )
}

function DietPreview({
  meals, name, description, totals, target,
}: {
  meals: Meal[]
  name: string
  description: string
  totals: { kcal: number; protein: number; carbs: number; fat: number }
  target: number
}) {
  return (
    <div className="border bg-card">
      <div className="p-6 border-b">
        <p className="font-mono-tag text-primary mb-2">[ PREVIEW MODE ]</p>
        <h2 className="text-2xl font-bold tracking-tighter">{name || 'Untitled diet'}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          <div>
            <p className="text-2xl font-bold font-display tracking-tighter text-primary">{totals.kcal}</p>
            <p className="font-mono-tag text-muted-foreground">KCAL / TARGET {target}</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-display tracking-tighter">{totals.protein}g</p>
            <p className="font-mono-tag text-muted-foreground">PROTEIN</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-display tracking-tighter">{totals.carbs}g</p>
            <p className="font-mono-tag text-muted-foreground">CARBS</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-display tracking-tighter">{totals.fat}g</p>
            <p className="font-mono-tag text-muted-foreground">FAT</p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {meals.map((meal, mealIdx) => {
          const mealInfo = MEAL_TYPES.find(m => m.id === meal.meal)
          const t = sumMeal(meal.foods)

          return (
            <div key={meal.id} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-mono-tag font-bold text-[9px]">
                  {mealInfo?.label}
                </div>
                <div className="flex-1">
                  <p className="font-mono-tag text-muted-foreground">
                    MEAL {String(mealIdx + 1).padStart(2, '0')} • {mealInfo?.full.toUpperCase()}
                    {meal.time && ` • ${meal.time}`}
                  </p>
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                </div>
                <div className="text-right">
                  <p className="font-mono-tag text-primary">{t.kcal} KCAL</p>
                  <p className="font-mono-tag text-muted-foreground">
                    {t.protein}P • {t.carbs}C • {t.fat}F
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {meal.foods.map((food, idx) => {
                  const ft = macrosForQuantity(food, food.quantity)
                  return (
                    <div key={food.id} className="flex items-start gap-3 p-3 bg-muted/30 border-l-2 border-primary">
                      <span className="font-mono-tag text-muted-foreground text-xs pt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {food.name || 'Untitled food'}
                          <span className="text-muted-foreground font-normal"> • {food.quantity}g</span>
                        </p>
                        <p className="font-mono-tag text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                          <span className="text-primary">{ft.kcal} KCAL</span>
                          <span>{ft.protein}g P</span>
                          <span>{ft.carbs}g C</span>
                          <span>{ft.fat}g F</span>
                        </p>
                        {food.notes && (
                          <p className="text-sm text-muted-foreground mt-1.5 italic">{food.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
