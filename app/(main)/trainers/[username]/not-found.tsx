import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX, ArrowLeft } from 'lucide-react'

export default function TrainerNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <div className="border border-dashed p-8 space-y-4 text-center">
        <div className="inline-flex w-12 h-12 bg-muted items-center justify-center text-muted-foreground">
          <SearchX size={20} />
        </div>

        <div className="space-y-1">
          <p className="font-mono-tag text-muted-foreground">[ TRAINER / NOT FOUND ]</p>
          <h1 className="text-2xl font-bold tracking-tighter">
            Trainer not found.
          </h1>
          <p className="text-muted-foreground text-sm">
            This trainer doesn&apos;t exist or has set their profile to private.
          </p>
        </div>

        <Button asChild size="sm">
          <Link href="/trainers">
            <ArrowLeft size={14} className="mr-2" />
            Back to trainers
          </Link>
        </Button>
      </div>
    </div>
  )
}
