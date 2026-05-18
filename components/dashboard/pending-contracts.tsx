'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { respondContractAction } from '@/app/actions/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/shared/avatar'
import { Check, X } from 'lucide-react'

type Contract = {
  id: string
  status: string
  created_at: string
  client: {
    full_name: string
    avatar_url: string | null
  }
}

type PendingContractsProps = {
  contracts: Contract[]
}

export function PendingContracts({ contracts }: PendingContractsProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  if (contracts.length === 0) return null

  async function handleRespond(contractId: string, status: 'active' | 'rejected') {
    setLoadingId(contractId)
    await respondContractAction(contractId, status)
    router.refresh()
    setLoadingId(null)
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-semibold">Pending Requests ({contracts.length})</h3>
        </div>
        <div className="space-y-2">
          {contracts.map(contract => (
            <div key={contract.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background border">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={contract.client.avatar_url} name={contract.client.full_name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{contract.client.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(contract.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleRespond(contract.id, 'active')}
                  disabled={loadingId === contract.id}
                >
                  <Check size={14} />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRespond(contract.id, 'rejected')}
                  disabled={loadingId === contract.id}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
