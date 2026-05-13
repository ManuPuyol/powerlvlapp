'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { hireTrainerAction } from '@/app/actions/contracts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type HireButtonProps = {
  trainerId: string
  contractStatus: string | null
}

export function HireButton({ trainerId, contractStatus }: HireButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si ya hay contrato, mostrar estado
  if (contractStatus === 'pending') {
    return <Badge variant="secondary">Request Pending</Badge>
  }

  if (contractStatus === 'active') {
    return <Badge variant="default">Active Contract</Badge>
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
    <div>
      <Button onClick={handleHire} disabled={loading}>
        {loading ? 'Sending request...' : 'Hire Trainer'}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}
