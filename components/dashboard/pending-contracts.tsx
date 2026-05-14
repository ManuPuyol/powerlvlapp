'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { respondContractAction } from '@/app/actions/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/shared/avatar'

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

  if (contracts.length === 0) {
    return null
  }

  async function handleRespond(contractId: string, status: 'active' | 'rejected') {
    setLoadingId(contractId)
    await respondContractAction(contractId, status)
    router.refresh()
    setLoadingId(null)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Pending Requests ({contracts.length})</h3>
        <div className="space-y-3">
          {contracts.map(contract => (
            <div key={contract.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Avatar src={contract.client.avatar_url} name={contract.client.full_name} size="sm" />
                <span className="text-sm font-medium">{contract.client.full_name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleRespond(contract.id, 'active')}
                  disabled={loadingId === contract.id}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRespond(contract.id, 'rejected')}
                  disabled={loadingId === contract.id}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
