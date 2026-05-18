'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { hireTrainerAction } from '@/app/actions/contracts'
import { Button } from '@/components/ui/button'
import { Check, Clock } from 'lucide-react'

type HireButtonProps = {
  trainerId: string
  contractStatus: string | null
}

export function HireButton({ trainerId, contractStatus }: HireButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (contractStatus === 'pending') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
        <Clock size={16} />
        Request Pending
      </div>
    )
  }

  if (contractStatus === 'active') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
        <Check size={16} />
        Active Contract
      </div>
    )
  }

  async function handleHire() {
    setLoading(true)
    setError(null)
    const result = await hireTrainerAction(trainerId)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.refresh()
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleHire} disabled={loading} size="lg">
        {loading ? 'Sending...' : 'Hire Trainer'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
