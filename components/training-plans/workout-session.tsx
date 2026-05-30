'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  X, Check, Pause, Play, RotateCw,
  ChevronLeft, ChevronRight, Trophy, Clock,
  Image as ImageIcon, Video,
} from 'lucide-react'
import type { MockDay, MockExercise } from '@/lib/mock-plans'

type SetState = 'pending' | 'completed' | 'skipped'

type ExerciseProgress = {
  exerciseId: string
  sets: SetState[]
}

type WorkoutSessionProps = {
  day: MockDay
  planId: string
  planName: string
}

export function WorkoutSession({ day, planId, planName }: WorkoutSessionProps) {
  const router = useRouter()
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [progress, setProgress] = useState<ExerciseProgress[]>(
    day.exercises.map(e => ({
      exerciseId: e.id,
      sets: Array.from({ length: e.sets }, () => 'pending' as SetState),
    }))
  )
  const [restSeconds, setRestSeconds] = useState(0)
  const [restPaused, setRestPaused] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showFinishScreen, setShowFinishScreen] = useState(false)
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentExercise = day.exercises[exerciseIdx]
  const nextExercise = day.exercises[exerciseIdx + 1]
  const currentProgress = progress[exerciseIdx]

  // Timer del workout total
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  // Rest timer
  useEffect(() => {
    if (restSeconds > 0 && !restPaused) {
      restIntervalRef.current = setTimeout(() => {
        setRestSeconds(s => Math.max(0, s - 1))
      }, 1000)
    }
    return () => {
      if (restIntervalRef.current) clearTimeout(restIntervalRef.current)
    }
  }, [restSeconds, restPaused])

  // Stats globales
  const totalSets = day.exercises.reduce((acc, e) => acc + e.sets, 0)
  const completedSets = progress.reduce(
    (acc, p) => acc + p.sets.filter(s => s === 'completed').length, 0
  )
  const overallProgress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  // Sets actuales
  const exerciseDone = currentProgress.sets.every(s => s !== 'pending')
  const allDone = progress.every(p => p.sets.every(s => s !== 'pending'))

  function toggleSet(setIdx: number) {
    setProgress(prev => prev.map((p, i) => {
      if (i !== exerciseIdx) return p
      const newSets = [...p.sets]
      const current = newSets[setIdx]
      newSets[setIdx] = current === 'completed' ? 'pending' : 'completed'
      return { ...p, sets: newSets }
    }))

    // Si estamos completando un set, iniciar timer de descanso
    const current = currentProgress.sets[setIdx]
    if (current !== 'completed' && currentExercise.rest > 0) {
      setRestSeconds(currentExercise.rest)
      setRestPaused(false)
    }
  }

  function skipRest() {
    setRestSeconds(0)
  }

  function nextExerciseHandler() {
    if (exerciseIdx < day.exercises.length - 1) {
      setExerciseIdx(i => i + 1)
      setRestSeconds(0)
    } else if (allDone) {
      setShowFinishScreen(true)
    }
  }

  function prevExerciseHandler() {
    if (exerciseIdx > 0) {
      setExerciseIdx(i => i - 1)
      setRestSeconds(0)
    }
  }

  function handleFinish() {
    router.push(`/dashboard/my-plans/${planId}`)
  }

  if (showFinishScreen) {
    return <FinishScreen
      elapsedTime={elapsedTime}
      completedSets={completedSets}
      totalSets={totalSets}
      onFinish={handleFinish}
      planName={planName}
      dayName={day.name}
    />
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">

      {/* Top bar */}
      <header className="border-b bg-card">
        <div className="flex items-center gap-3 p-4">
          <Link
            href={`/dashboard/my-plans/${planId}`}
            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-mono-tag text-muted-foreground truncate">
              {planName.toUpperCase()} • {day.name.toUpperCase()}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="font-mono-tag text-primary inline-flex items-center gap-1">
                <Clock size={12} /> {formatTime(elapsedTime)}
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="font-mono-tag text-muted-foreground">
                {completedSets}/{totalSets} SETS
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono-tag text-muted-foreground">PROGRESS</p>
            <p className="font-mono-tag text-primary text-lg font-bold font-display">
              {overallProgress}%
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 space-y-6">

          {/* Exercise navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevExerciseHandler}
              disabled={exerciseIdx === 0}
              className="inline-flex items-center gap-1 font-mono-tag text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
              PREV
            </button>
            <span className="font-mono-tag text-muted-foreground">
              EXERCISE {String(exerciseIdx + 1).padStart(2, '0')} / {String(day.exercises.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={nextExerciseHandler}
              disabled={exerciseIdx === day.exercises.length - 1 && !allDone}
              className="inline-flex items-center gap-1 font-mono-tag text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              NEXT
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Current exercise */}
          <ExerciseCard
            exercise={currentExercise}
            setStates={currentProgress.sets}
            onToggleSet={toggleSet}
          />

          {/* Rest timer */}
          {restSeconds > 0 && (
            <RestTimer
              seconds={restSeconds}
              paused={restPaused}
              onTogglePause={() => setRestPaused(p => !p)}
              onSkip={skipRest}
            />
          )}

          {/* Next exercise preview */}
          {nextExercise && (
            <div className="border bg-muted/30 p-4 space-y-2">
              <p className="font-mono-tag text-muted-foreground">UP NEXT</p>
              <p className="font-bold">{nextExercise.name}</p>
              <p className="font-mono-tag text-muted-foreground">
                {nextExercise.sets} × {nextExercise.reps}
                {nextExercise.rest > 0 && ` • ${nextExercise.rest}s REST`}
              </p>
            </div>
          )}

          {/* Action button */}
          <div className="pb-6">
            {exerciseDone && exerciseIdx < day.exercises.length - 1 ? (
              <Button onClick={nextExerciseHandler} className="w-full" size="lg">
                Next exercise
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : allDone ? (
              <Button onClick={() => setShowFinishScreen(true)} className="w-full" size="lg">
                <Trophy size={16} className="mr-1.5" />
                Finish workout
              </Button>
            ) : (
              <p className="text-center font-mono-tag text-muted-foreground py-4">
                COMPLETE ALL SETS TO CONTINUE
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function ExerciseCard({
  exercise,
  setStates,
  onToggleSet,
}: {
  exercise: MockExercise
  setStates: SetState[]
  onToggleSet: (idx: number) => void
}) {
  return (
    <div className="border-2 border-primary bg-card overflow-hidden">

      <div className="bg-primary text-primary-foreground p-4">
        <p className="font-mono-tag opacity-70 mb-1">CURRENT EXERCISE</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">{exercise.name}</h2>
      </div>

      <div className="p-5 space-y-5">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="border p-3">
            <p className="font-mono-tag text-muted-foreground text-[10px]">SETS</p>
            <p className="text-2xl font-bold font-display tracking-tighter">
              {exercise.sets}
            </p>
          </div>
          <div className="border p-3">
            <p className="font-mono-tag text-muted-foreground text-[10px]">REPS</p>
            <p className="text-2xl font-bold font-display tracking-tighter">
              {exercise.reps}
            </p>
          </div>
          <div className="border p-3">
            <p className="font-mono-tag text-muted-foreground text-[10px]">REST</p>
            <p className="text-2xl font-bold font-display tracking-tighter">
              {exercise.rest}<span className="text-sm">s</span>
            </p>
          </div>
        </div>

        {/* Tempo + RPE */}
        {(exercise.tempo || exercise.rpe) && (
          <div className="flex items-center justify-center gap-4 font-mono-tag">
            {exercise.tempo && (
              <span className="text-muted-foreground">TEMPO {exercise.tempo}</span>
            )}
            {exercise.rpe && (
              <span className="text-primary">RPE {exercise.rpe}</span>
            )}
          </div>
        )}

        {/* Notes */}
        {exercise.notes && (
          <div className="border-l-2 border-primary bg-muted/30 p-3">
            <p className="font-mono-tag text-muted-foreground mb-1">COACH NOTES</p>
            <p className="text-sm italic">{exercise.notes}</p>
          </div>
        )}

        {/* Media */}
        {exercise.media.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exercise.media.map((m, i) => (
              <button
                key={i}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border bg-background hover:border-primary transition-colors text-xs font-mono-tag"
              >
                {m.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />}
                VIEW {m.type.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Sets checklist */}
        <div className="space-y-2">
          <p className="font-mono-tag text-muted-foreground">TRACK YOUR SETS</p>
          <div className="space-y-2">
            {setStates.map((state, idx) => (
              <SetRow
                key={idx}
                index={idx}
                state={state}
                reps={exercise.reps}
                onClick={() => onToggleSet(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SetRow({
  index,
  state,
  reps,
  onClick,
}: {
  index: number
  state: SetState
  reps: string
  onClick: () => void
}) {
  const completed = state === 'completed'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 border text-left transition-all',
        completed
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <div className={cn(
        'w-8 h-8 flex items-center justify-center font-mono-tag font-bold border transition-all',
        completed
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border'
      )}>
        {completed ? <Check size={14} /> : String(index + 1).padStart(2, '0')}
      </div>
      <div className="flex-1">
        <p className={cn('font-medium', completed && 'line-through text-muted-foreground')}>
          Set {index + 1}
        </p>
        <p className="font-mono-tag text-muted-foreground">
          {reps} REPS
        </p>
      </div>
      {completed && (
        <span className="font-mono-tag text-primary">DONE</span>
      )}
    </button>
  )
}

function RestTimer({
  seconds,
  paused,
  onTogglePause,
  onSkip,
}: {
  seconds: number
  paused: boolean
  onTogglePause: () => void
  onSkip: () => void
}) {
  return (
    <div className="border-2 border-primary bg-primary/5 p-5 space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono-tag text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          RESTING
        </div>
        <span className="font-mono-tag text-muted-foreground">RECOVER</span>
      </div>

      <p className="text-center text-6xl md:text-7xl font-bold font-display tracking-tighter text-primary">
        {formatTime(seconds)}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onTogglePause}
          className="flex-1"
        >
          {paused ? (
            <>
              <Play size={14} className="mr-1.5" />
              Resume
            </>
          ) : (
            <>
              <Pause size={14} className="mr-1.5" />
              Pause
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onSkip}
          className="flex-1"
        >
          Skip rest
          <ChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}

function FinishScreen({
  elapsedTime,
  completedSets,
  totalSets,
  onFinish,
  planName,
  dayName,
}: {
  elapsedTime: number
  completedSets: number
  totalSets: number
  onFinish: () => void
  planName: string
  dayName: string
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up text-center">

        <div className="inline-flex w-20 h-20 bg-primary/10 items-center justify-center text-primary border-2 border-primary">
          <Trophy size={36} />
        </div>

        <div className="space-y-2">
          <p className="font-mono-tag text-primary">[ WORKOUT COMPLETE ]</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
            Great work.
          </h1>
          <p className="text-muted-foreground">
            {planName} • {dayName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border p-4 text-left">
            <p className="font-mono-tag text-muted-foreground">DURATION</p>
            <p className="text-2xl font-bold font-display tracking-tighter text-primary">
              {formatTime(elapsedTime)}
            </p>
          </div>
          <div className="border p-4 text-left">
            <p className="font-mono-tag text-muted-foreground">SETS DONE</p>
            <p className="text-2xl font-bold font-display tracking-tighter text-primary">
              {String(completedSets).padStart(2, '0')}/{String(totalSets).padStart(2, '0')}
            </p>
          </div>
        </div>

        <Button onClick={onFinish} className="w-full" size="lg">
          Done
        </Button>
      </div>
    </div>
  )
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
