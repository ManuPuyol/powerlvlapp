import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/avatar'
import { AssignDietDialog } from '@/components/diet-plans/assign-diet-dialog'
import { getMockDiet, getMockDietStats, mealTotals } from '@/lib/mock-diets'
import { MEAL_TYPES, DIET_GOALS, DIET_DIFFICULTY, macrosForQuantity } from '@/lib/food-library'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Edit, Copy, Trash2, UserPlus, Flame, FileText,
} from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function DietDetailPage({ params }: Props) {
  const { id } = await params
  const diet = getMockDiet(id)

  if (!diet) notFound()

  const stats = getMockDietStats(diet)
  const goalInfo = DIET_GOALS.find(g => g.id === diet.goal)
  const difficultyInfo = DIET_DIFFICULTY.find(d => d.id === diet.difficulty)
  const kcalDiff = stats.kcal - diet.target_kcal

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in-up">

      {/* Back link */}
      <Link
        href="/dashboard/diet-plans"
        className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={12} />
        BACK TO DIETS
      </Link>

      {/* Hero */}
      <div className="border bg-card overflow-hidden">

        {/* Top stripe with type indicator */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            {diet.is_template ? (
              <div className="inline-flex items-center gap-2 font-mono-tag text-muted-foreground">
                <FileText size={12} />
                TEMPLATE • CAN BE ASSIGNED TO MULTIPLE CLIENTS
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 font-mono-tag text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                ACTIVE DIET
              </div>
            )}
            <span className="font-mono-tag text-muted-foreground">UPDATED {diet.updated_at.toUpperCase()}</span>
          </div>
        </div>

        {/* Main info */}
        <div className="p-6 md:p-8 space-y-6">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.05]">
                {diet.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">{diet.description}</p>

              {/* Tags */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <span className={cn('font-mono-tag', goalInfo?.color)}>
                  {goalInfo?.label.toUpperCase()}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono-tag text-muted-foreground inline-flex items-center gap-1">
                  {difficultyInfo?.label.toUpperCase()}
                  <span className="flex gap-0.5 ml-1">
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
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono-tag text-muted-foreground inline-flex items-center gap-1">
                  <Flame size={11} /> {diet.target_kcal} KCAL TARGET
                </span>
              </div>
            </div>
          </div>

          {/* Assigned client */}
          {diet.assigned_to && (
            <Link
              href={`/trainers/${diet.assigned_to.username}`}
              className="group flex items-center gap-3 p-4 border bg-background hover:border-primary transition-colors max-w-md"
            >
              <Avatar src={diet.assigned_to.avatar_url} name={diet.assigned_to.full_name} size="sm" />
              <div className="flex-1">
                <p className="font-mono-tag text-muted-foreground">ASSIGNED TO</p>
                <p className="font-bold group-hover:text-primary transition-colors">
                  {diet.assigned_to.full_name}
                </p>
              </div>
            </Link>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link href={`/dashboard/diet-plans/${diet.id}/edit`}>
                <Edit size={14} className="mr-1.5" />
                Edit diet
              </Link>
            </Button>
            {diet.is_template && (
              <AssignDietDialog
                dietName={diet.name}
                trigger={
                  <Button variant="outline">
                    <UserPlus size={14} className="mr-1.5" />
                    Assign to client
                  </Button>
                }
              />
            )}
            <Button variant="outline">
              <Copy size={14} className="mr-1.5" />
              Duplicate
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 size={14} className="mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBlock label="TOTAL KCAL" value={String(stats.kcal)} accent hint={`${kcalDiff > 0 ? '+' : ''}${kcalDiff} vs target`} />
        <StatBlock label="PROTEIN" value={`${stats.protein}g`} />
        <StatBlock label="CARBS" value={`${stats.carbs}g`} />
        <StatBlock label="FAT" value={`${stats.fat}g`} />
      </div>

      {/* Meals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono-tag text-muted-foreground">MEAL PLAN</p>
          <span className="font-mono-tag text-muted-foreground">
            {String(diet.meals.length).padStart(2, '0')} MEALS • {String(stats.foods).padStart(2, '0')} FOODS
          </span>
        </div>

        {diet.meals.length === 0 ? (
          <div className="border border-dashed p-12 text-center">
            <p className="font-mono-tag text-muted-foreground">[ NO MEALS YET ]</p>
            <p className="text-sm text-muted-foreground mt-1">Edit the diet to add meals</p>
          </div>
        ) : (
          diet.meals.map((meal, mealIdx) => {
            const mealInfo = MEAL_TYPES.find(m => m.id === meal.meal)
            const t = mealTotals(meal)

            return (
              <div key={meal.id} className="border bg-card">
                <div className="flex items-center gap-3 p-4 border-b">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex flex-col items-center justify-center font-mono-tag font-bold leading-none">
                    <span className="text-[10px] opacity-70">{String(mealIdx + 1).padStart(2, '0')}</span>
                    <span className="text-[9px]">{mealInfo?.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-tag text-muted-foreground">
                      {mealInfo?.full.toUpperCase()} • {meal.foods.length} FOODS
                      {meal.time && ` • ${meal.time}`}
                    </p>
                    <h3 className="font-bold text-lg">{meal.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-tag text-primary inline-flex items-center gap-1">
                      <Flame size={10} /> {t.kcal}
                    </p>
                    <p className="font-mono-tag text-muted-foreground">
                      {t.protein}P • {t.carbs}C • {t.fat}F
                    </p>
                  </div>
                </div>

                <div className="divide-y">
                  {meal.foods.map((food, idx) => {
                    const ft = macrosForQuantity(food, food.quantity)
                    return (
                      <div key={food.id} className="p-4 flex items-start gap-3">
                        <span className="font-mono-tag text-muted-foreground text-xs pt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {food.name}
                            <span className="text-muted-foreground font-normal"> • {food.quantity}g</span>
                          </p>
                          <p className="font-mono-tag text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                            <span className="text-primary">{ft.kcal} KCAL</span>
                            <span>{ft.protein}g P</span>
                            <span>{ft.carbs}g C</span>
                            <span>{ft.fat}g F</span>
                            {food.category && (
                              <>
                                <span className="text-muted-foreground/40">•</span>
                                <span>{food.category.toUpperCase()}</span>
                              </>
                            )}
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
          })
        )}
      </div>
    </div>
  )
}

function StatBlock({ label, value, accent, hint }: { label: string; value: string; accent?: boolean; hint?: string }) {
  return (
    <div className={cn(
      'border bg-card p-4 relative overflow-hidden',
      accent && 'border-primary'
    )}>
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5',
        accent ? 'bg-primary' : 'bg-foreground/10'
      )} />
      <p className="font-mono-tag text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl md:text-3xl font-bold font-display tracking-tighter">{value}</p>
      {hint && <p className="font-mono-tag text-muted-foreground mt-1 text-[10px]">{hint}</p>}
    </div>
  )
}
