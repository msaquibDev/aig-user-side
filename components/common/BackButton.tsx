'use client'

import type { ComponentProps } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type BackButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  label?: string
  showIcon?: boolean
  /**
   * Where to navigate if there's no history to go back to (e.g. direct visit).
   * Defaults to "/".
   */
  fallbackHref?: string
}

export default function BackButton({
  label = 'Back',
  showIcon = true,
  fallbackHref = '/dashboard/events',
  className,
  ...buttonProps
}: BackButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = () => {
    // 1) Prefer an explicit return target via query (?from=/event or ?returnTo=/event)
    const fromParam =
      searchParams.get('from') ||
      searchParams.get('returnTo') ||
      searchParams.get('backTo')

    const isSafeInternalPath = (p: string) =>
      typeof p === 'string' && p.startsWith('/') && !p.startsWith('//')

    if (fromParam && isSafeInternalPath(fromParam)) {
      router.push(fromParam)
      return
    }

    // 2) If there is SPA history to go back to, use router.back()
    //    Next.js router.back() equals window.history.back() [^3]
    if (typeof window !== 'undefined') {
      const idx =
        (window.history.state && (window.history.state as any).idx) ?? 0
      if (idx > 0) {
        router.back()
        return
      }
    }

    // 3) Fallback to a known safe route
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
        className
      )}
      onClick={handleClick}
      aria-label="Go back"
      {...buttonProps}
    >
      {showIcon ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{label}</span>
    </Button>
  )
}
