'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExerciseInput } from './exercise-input'
import {
  Plus, Trash2, Image as ImageIcon, Video, X,
  Copy, ChevronUp, ChevronDown, Eye, Save,
  Clock, Flame, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PLAN_GOALS, DIFFICULTY_LEVELS,
  type PlanGoal, type DifficultyLevel,
} from '@/lib/exercise-library'
import type { MockPlan } from '@/lib/mock-plans'

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'MON', full: 'Monday' },
  { id: 'tuesday', label: 'TUE', full: 'Tuesday' },
  { id: 'wednesday', label: 'WED', full: 'Wednesday' },
  { id: 'thursday', label: 'THU', full: 'Thursday' },
  { id: 'friday', label: 'FRI', full: 'Friday' },
  { id: 'saturday', label: 'SAT', full: 'Saturday' },
  { id: 'sunday', label: 'SUN', full: 'Sunday' },
] as const

type DayId = typeof DAYS_OF_WEEK[number]['id']

type Exercise = {
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

type TrainingDay = {
  id: string
  day: DayId
  name: string
  exercises: Exercise[]
}

function uid() {
  return Math.random().toString(36).slice(2, 11)
}

function newExercise(): Exercise {
  return {
    id: uid(),
    name: '',
    sets: 3,
    reps: '10',
    rest: 60,
    tempo: '',
    rpe: '',
    notes: '',
    media: [],
  }
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function PlanBuilder({ initialPlan }: { initialPlan?: MockPlan } = {}) {
  const [name, setName] = useState(initialPlan?.name ?? '')
  const [description, setDescription] = useState(initialPlan?.description ?? '')
  const [goal, setGoal] = useState<PlanGoal>(initialPlan?.goal ?? 'hypertrophy')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialPlan?.difficulty ?? 'intermediate')
  const [weeks, setWeeks] = useState(String(initialPlan?.weeks ?? 8))
  const [days, setDays] = useState<TrainingDay[]>(
    initialPlan?.days.map(d => ({
      id: d.id,
      day: d.day,
      name: d.name,
      exercises: d.exercises.map(e => ({ ...e })),
    })) ?? []
  )
  const [previewMode, setPreviewMode] = useState(false)

  const usedDays = new Set(days.map(d => d.day))
  const totalExercises = days.reduce((acc, d) => acc + d.exercises.length, 0)
  const totalSets = days.reduce(
    (acc, d) => acc + d.exercises.reduce((s, e) => s + e.sets, 0),
    0
  )
  const estimatedTime = days.reduce((acc, d) => {
    return acc + d.exercises.reduce((s, e) => {
      // ~45s por set + descanso entre sets
      return s + (e.sets * 45) + ((e.sets - 1) * e.rest)
    }, 0)
  }, 0)

  function addDay(dayId: DayId) {
    const dayLabel = DAYS_OF_WEEK.find(d => d.id === dayId)?.full ?? ''
    const newDay: TrainingDay = {
      id: uid(),
      day: dayId,
      name: `${dayLabel} workout`,
      exercises: [newExercise()],
    }
    setDays(prev => {
      const next = [...prev, newDay]
      // Mantener orden de la semana
      const order = DAYS_OF_WEEK.map(d => d.id)
      return next.sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day))
    })
  }

  function removeDay(id: string) {
    setDays(prev => prev.filter(d => d.id !== id))
  }

  function duplicateDay(id: string) {
    const day = days.find(d => d.id === id)
    if (!day) return
    // Buscar un día libre
    const freeDay = DAYS_OF_WEEK.find(d => !usedDays.has(d.id))
    if (!freeDay) {
      alert('All days are already in use')
      return
    }
    const copy: TrainingDay = {
      ...day,
      id: uid(),
      day: freeDay.id,
      name: `${day.name} (copy)`,
      exercises: day.exercises.map(e => ({ ...e, id: uid() })),
    }
    setDays(prev => {
      const next = [...prev, copy]
      const order = DAYS_OF_WEEK.map(d => d.id)
      return next.sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day))
    })
  }

  function updateDay(id: string, patch: Partial<TrainingDay>) {
    setDays(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d))
  }

  function addExercise(dayId: string) {
    setDays(prev => prev.map(d =>
      d.id === dayId ? { ...d, exercises: [...d.exercises, newExercise()] } : d
    ))
  }

  function updateExercise(dayId: string, exId: string, patch: Partial<Exercise>) {
    setDays(prev => prev.map(d =>
      d.id === dayId
        ? { ...d, exercises: d.exercises.map(e => e.id === exId ? { ...e, ...patch } : e) }
        : d
    ))
  }

  function removeExercise(dayId: string, exId: string) {
    setDays(prev => prev.map(d =>
      d.id === dayId
        ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) }
        : d
    ))
  }

  function duplicateExercise(dayId: string, exId: string) {
    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d
      const ex = d.exercises.find(e => e.id === exId)
      if (!ex) return d
      const idx = d.exercises.findIndex(e => e.id === exId)
      const copy = { ...ex, id: uid(), media: [...ex.media] }
      const exercises = [...d.exercises]
      exercises.splice(idx + 1, 0, copy)
      return { ...d, exercises }
    }))
  }

  function moveExercise(dayId: string, exId: string, direction: -1 | 1) {
    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d
      const idx = d.exercises.findIndex(e => e.id === exId)
      return { ...d, exercises: move(d.exercises, idx, idx + direction) }
    }))
  }

  function addMedia(dayId: string, exId: string, type: 'image' | 'video') {
    const url = prompt(`Paste ${type} URL`)
    if (!url) return
    updateExercise(dayId, exId, {
      media: [
        ...(days.find(d => d.id === dayId)?.exercises.find(e => e.id === exId)?.media ?? []),
        { type, url },
      ],
    })
  }

  function removeMedia(dayId: string, exId: string, idx: number) {
    const ex = days.find(d => d.id === dayId)?.exercises.find(e => e.id === exId)
    if (!ex) return
    updateExercise(dayId, exId, {
      media: ex.media.filter((_, i) => i !== idx),
    })
  }

  const goalInfo = PLAN_GOALS.find(g => g.id === goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === difficulty)

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">

        {/* Plan info */}
        <div className="border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-mono-tag text-muted-foreground">PLAN INFO</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="font-mono-tag text-muted-foreground">NAME</Label>
              <Input
                placeholder="Hypertrophy 4 days"
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
              <Select value={goal} onValueChange={v => setGoal(v as PlanGoal)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_GOALS.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="font-mono-tag text-muted-foreground">LEVEL</Label>
                <Select value={difficulty} onValueChange={v => setDifficulty(v as DifficultyLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono-tag text-muted-foreground">WEEKS</Label>
                <Input
                  type="number"
                  min="1"
                  value={weeks}
                  onChange={e => setWeeks(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Day picker */}
        <div className="border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-mono-tag text-muted-foreground">SCHEDULE</p>
            <span className="font-mono-tag text-muted-foreground">
              {String(days.length).padStart(2, '0')}/07
            </span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map(day => {
                const isUsed = usedDays.has(day.id)
                return (
                  <button
                    key={day.id}
                    type="button"
                    disabled={isUsed}
                    onClick={() => addDay(day.id)}
                    className={cn(
                      'aspect-square flex items-center justify-center font-mono-tag text-xs border transition-all',
                      isUsed
                        ? 'bg-primary text-primary-foreground border-primary cursor-default'
                        : 'border-border hover:border-primary hover:text-primary'
                    )}
                  >
                    {day.label[0]}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Tap a day to add it to the plan
            </p>
          </div>
        </div>

        {/* Live stats */}
        <div className="border bg-card p-4 space-y-4">
          <p className="font-mono-tag text-muted-foreground">LIVE STATS</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-bold font-display tracking-tighter text-primary">
                {String(days.length).padStart(2, '0')}
              </p>
              <p className="font-mono-tag text-muted-foreground">DAYS</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display tracking-tighter text-primary">
                {String(totalExercises).padStart(2, '0')}
              </p>
              <p className="font-mono-tag text-muted-foreground">EXERCISES</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display tracking-tighter text-primary">
                {String(totalSets).padStart(2, '0')}
              </p>
              <p className="font-mono-tag text-muted-foreground">SETS / WEEK</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display tracking-tighter text-primary">
                {Math.round(estimatedTime / 60 / Math.max(days.length, 1))}m
              </p>
              <p className="font-mono-tag text-muted-foreground">AVG / DAY</p>
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
            disabled={!name || days.length === 0}
          >
            <Save size={14} className="mr-1.5" />
            Save plan
          </Button>
        </div>
      </aside>

      {/* Editor / Preview */}
      <div className="space-y-4 min-w-0">

        {days.length === 0 ? (
          <div className="border border-dashed p-12 text-center space-y-4">
            <div className="inline-flex w-12 h-12 bg-muted items-center justify-center text-muted-foreground">
              <Activity size={20} />
            </div>
            <div>
              <p className="font-mono-tag text-muted-foreground">[ EMPTY PLAN ]</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tap a day in the sidebar to start building
              </p>
            </div>
          </div>
        ) : previewMode ? (
          <PlanPreview days={days} name={name} description={description} />
        ) : (
          days.map((day, dayIdx) => (
            <DayCard
              key={day.id}
              day={day}
              dayIdx={dayIdx}
              onUpdate={patch => updateDay(day.id, patch)}
              onRemove={() => removeDay(day.id)}
              onDuplicate={() => duplicateDay(day.id)}
              onAddExercise={() => addExercise(day.id)}
              onUpdateExercise={(exId, patch) => updateExercise(day.id, exId, patch)}
              onRemoveExercise={exId => removeExercise(day.id, exId)}
              onDuplicateExercise={exId => duplicateExercise(day.id, exId)}
              onMoveExercise={(exId, dir) => moveExercise(day.id, exId, dir)}
              onAddMedia={(exId, type) => addMedia(day.id, exId, type)}
              onRemoveMedia={(exId, idx) => removeMedia(day.id, exId, idx)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function DayCard({
  day, dayIdx, onUpdate, onRemove, onDuplicate, onAddExercise,
  onUpdateExercise, onRemoveExercise, onDuplicateExercise, onMoveExercise,
  onAddMedia, onRemoveMedia,
}: {
  day: TrainingDay
  dayIdx: number
  onUpdate: (patch: Partial<TrainingDay>) => void
  onRemove: () => void
  onDuplicate: () => void
  onAddExercise: () => void
  onUpdateExercise: (exId: string, patch: Partial<Exercise>) => void
  onRemoveExercise: (exId: string) => void
  onDuplicateExercise: (exId: string) => void
  onMoveExercise: (exId: string, dir: -1 | 1) => void
  onAddMedia: (exId: string, type: 'image' | 'video') => void
  onRemoveMedia: (exId: string, idx: number) => void
}) {
  const dayInfo = DAYS_OF_WEEK.find(d => d.id === day.day)
  const totalSets = day.exercises.reduce((s, e) => s + e.sets, 0)

  return (
    <article className="border bg-card animate-fade-in-up">

      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-12 h-12 bg-primary text-primary-foreground flex flex-col items-center justify-center font-mono-tag font-bold leading-none">
          <span className="text-[10px] opacity-70">{String(dayIdx + 1).padStart(2, '0')}</span>
          <span className="text-xs">{dayInfo?.label}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono-tag text-muted-foreground">
            {dayInfo?.full.toUpperCase()} • {day.exercises.length} EX • {totalSets} SETS
          </p>
          <Input
            value={day.name}
            onChange={e => onUpdate({ name: e.target.value })}
            className="border-0 px-0 h-auto py-1 text-lg font-bold focus-visible:ring-0"
            placeholder="Workout name"
          />
        </div>
        <button
          type="button"
          onClick={onDuplicate}
          title="Duplicate day"
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          title="Remove day"
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="divide-y">
        {day.exercises.map((exercise, exIdx) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            index={exIdx}
            isFirst={exIdx === 0}
            isLast={exIdx === day.exercises.length - 1}
            onUpdate={patch => onUpdateExercise(exercise.id, patch)}
            onRemove={() => onRemoveExercise(exercise.id)}
            onDuplicate={() => onDuplicateExercise(exercise.id)}
            onMove={dir => onMoveExercise(exercise.id, dir)}
            onAddMedia={type => onAddMedia(exercise.id, type)}
            onRemoveMedia={idx => onRemoveMedia(exercise.id, idx)}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddExercise}
          className="w-full"
        >
          <Plus size={14} className="mr-1" />
          Add exercise
        </Button>
      </div>
    </article>
  )
}

function ExerciseRow({
  exercise, index, isFirst, isLast,
  onUpdate, onRemove, onDuplicate, onMove,
  onAddMedia, onRemoveMedia,
}: {
  exercise: Exercise
  index: number
  isFirst: boolean
  isLast: boolean
  onUpdate: (patch: Partial<Exercise>) => void
  onRemove: () => void
  onDuplicate: () => void
  onMove: (dir: -1 | 1) => void
  onAddMedia: (type: 'image' | 'video') => void
  onRemoveMedia: (idx: number) => void
}) {
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

          <ExerciseInput
            value={exercise.name}
            onChange={(name, suggestion) => {
              onUpdate({
                name,
                category: suggestion?.category,
              })
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="space-y-1">
              <Label className="font-mono-tag text-muted-foreground text-[10px]">SETS</Label>
              <Input
                type="number"
                min="1"
                value={exercise.sets}
                onChange={e => onUpdate({ sets: parseInt(e.target.value) || 1 })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-mono-tag text-muted-foreground text-[10px]">REPS</Label>
              <Input
                value={exercise.reps}
                onChange={e => onUpdate({ reps: e.target.value })}
                placeholder="8-10"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-mono-tag text-muted-foreground text-[10px]">REST</Label>
              <Input
                type="number"
                min="0"
                value={exercise.rest}
                onChange={e => onUpdate({ rest: parseInt(e.target.value) || 0 })}
                placeholder="60"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-mono-tag text-muted-foreground text-[10px]">TEMPO</Label>
              <Input
                value={exercise.tempo}
                onChange={e => onUpdate({ tempo: e.target.value })}
                placeholder="3-1-1"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-mono-tag text-muted-foreground text-[10px]">RPE</Label>
              <Input
                value={exercise.rpe}
                onChange={e => onUpdate({ rpe: e.target.value })}
                placeholder="7-8"
                className="text-sm"
              />
            </div>
          </div>

          {exercise.media.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exercise.media.map((m, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted border text-xs font-mono-tag"
                >
                  {m.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />}
                  {m.type.toUpperCase()} {idx + 1}
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(idx)}
                    className="hover:text-destructive ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Textarea
            value={exercise.notes}
            onChange={e => onUpdate({ notes: e.target.value })}
            placeholder="Notes for the client (technique, cues, etc.)"
            rows={2}
            className="text-sm"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onAddMedia('image')}
              className="inline-flex items-center gap-1 text-xs font-mono-tag text-muted-foreground hover:text-primary transition-colors"
            >
              <ImageIcon size={12} /> ADD IMAGE
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button
              type="button"
              onClick={() => onAddMedia('video')}
              className="inline-flex items-center gap-1 text-xs font-mono-tag text-muted-foreground hover:text-primary transition-colors"
            >
              <Video size={12} /> ADD VIDEO
            </button>
            <span className="text-muted-foreground/30">|</span>
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

function PlanPreview({ days, name, description }: { days: TrainingDay[]; name: string; description: string }) {
  return (
    <div className="border bg-card">
      <div className="p-6 border-b">
        <p className="font-mono-tag text-primary mb-2">[ PREVIEW MODE ]</p>
        <h2 className="text-2xl font-bold tracking-tighter">{name || 'Untitled plan'}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      <div className="divide-y">
        {days.map((day, dayIdx) => {
          const dayInfo = DAYS_OF_WEEK.find(d => d.id === day.day)
          const totalSets = day.exercises.reduce((s, e) => s + e.sets, 0)
          const time = day.exercises.reduce(
            (acc, e) => acc + e.sets * 45 + (e.sets - 1) * e.rest,
            0
          )

          return (
            <div key={day.id} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-mono-tag font-bold text-xs">
                  {dayInfo?.label}
                </div>
                <div className="flex-1">
                  <p className="font-mono-tag text-muted-foreground">
                    DAY {String(dayIdx + 1).padStart(2, '0')} • {dayInfo?.full.toUpperCase()}
                  </p>
                  <h3 className="font-bold text-lg">{day.name}</h3>
                </div>
                <div className="text-right">
                  <p className="font-mono-tag text-primary inline-flex items-center gap-1">
                    <Clock size={10} /> {Math.round(time / 60)}m
                  </p>
                  <p className="font-mono-tag text-muted-foreground">{totalSets} SETS</p>
                </div>
              </div>

              <div className="space-y-2">
                {day.exercises.map((ex, idx) => (
                  <div key={ex.id} className="flex items-start gap-3 p-3 bg-muted/30 border-l-2 border-primary">
                    <span className="font-mono-tag text-muted-foreground text-xs pt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{ex.name || 'Untitled exercise'}</p>
                      <p className="font-mono-tag text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                        <span>{ex.sets} × {ex.reps}</span>
                        {ex.rest > 0 && <span>{ex.rest}s REST</span>}
                        {ex.tempo && <span>TEMPO {ex.tempo}</span>}
                        {ex.rpe && <span className="text-primary">RPE {ex.rpe}</span>}
                      </p>
                      {ex.notes && (
                        <p className="text-sm text-muted-foreground mt-1.5 italic">{ex.notes}</p>
                      )}
                      {ex.media.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {ex.media.map((m, i) => (
                            <span
                              key={i}
                              className="font-mono-tag text-xs px-1.5 py-0.5 bg-background border inline-flex items-center gap-1"
                            >
                              {m.type === 'image' ? <ImageIcon size={10} /> : <Video size={10} />}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
