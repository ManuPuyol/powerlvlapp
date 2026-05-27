import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md space-y-6 text-center">
        <div className="inline-flex w-14 h-14 bg-muted items-center justify-center text-muted-foreground border">
          <SearchX size={24} />
        </div>

        <div className="space-y-2">
          <p className="font-mono-tag text-muted-foreground">[ ERROR / 404 ]</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Page not found.
          </h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft size={14} className="mr-2" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
