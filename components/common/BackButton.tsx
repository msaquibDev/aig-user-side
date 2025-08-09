'use client'

import { useEffect, useState, type ComponentProps } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type BackButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  label?: string
  showIcon?: boolean
  fallbackHref?: string
}

export default function BackButton({
  label = 'Back',
  showIcon = true,
  fallbackHref = '/dashboard/events',
  fallbackHref = '/dashboard/events',
  className,
  ...buttonProps
}: BackButtonProps) {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)

  // Only run in browser after mount
  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search))
  }, [])

  const handleClick = () => {
    const fromParam =
      searchParams?.get('from') ||
      searchParams?.get('returnTo') ||
      searchParams?.get('backTo')

    const isSafeInternalPath = (p: string) =>
      typeof p === 'string' && p.startsWith('/') && !p.startsWith('//')

    if (fromParam && isSafeInternalPath(fromParam)) {
      router.push(fromParam)
      return
    }

    if (typeof window !== 'undefined') {
      const idx =
        (window.history.state && (window.history.state as any).idx) ?? 0
      if (idx > 0) {
        router.back()
        return
      }
    }

    if (fallbackHref) {
      router.push(fallbackHref)
    }
  }

  return (
    <Button
      type="button"
      variant={buttonProps.variant ?? 'ghost'}
      className={cn(
        'gap-2 transition-colors hover:bg-transparent hover:text-blue-600 cursor-pointer',
        'gap-2 transition-colors hover:bg-transparent hover:text-blue-600 cursor-pointer',
        className
      )}
      onClick={handleClick}
      aria-label="Go back"
      {...buttonProps}
    >
      {showIcon ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : null}
      {showIcon ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{label}</span>
    </Button>
  )
}
