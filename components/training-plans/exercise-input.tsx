'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { EXERCISE_LIBRARY, type ExerciseTemplate } from '@/lib/exercise-library'
import { cn } from '@/lib/utils'

type ExerciseInputProps = {
  value: string
  onChange: (value: string, suggestion?: ExerciseTemplate) => void
  className?: string
}

export function ExerciseInput({ value, onChange, className }: ExerciseInputProps) {
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sugerencias filtradas
  const suggestions = value.length >= 1
    ? EXERCISE_LIBRARY
        .filter(e => e.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 6)
    : []

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = suggestions[activeIdx]
      if (selected) {
        onChange(selected.name, selected)
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Input
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setOpen(true)
          setActiveIdx(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Exercise name (e.g. Bench Press)"
        className="font-medium"
      />

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-popover border shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((sug, idx) => (
            <button
              key={sug.name}
              type="button"
              onClick={() => {
                onChange(sug.name, sug)
                setOpen(false)
              }}
              onMouseEnter={() => setActiveIdx(idx)}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors',
                idx === activeIdx ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <span className="font-medium">{sug.name}</span>
              <span className={cn(
                'font-mono-tag text-xs',
                idx === activeIdx ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}>
                {sug.category.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
