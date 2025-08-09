'use client'

import type { ComponentProps } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type BackButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  label?: string
  showIcon?: boolean
  open?: boolean
  onToggle?: () => void
  fallbackHref?: string
}

export default function BackButton({
  label = 'Back',
  showIcon = true,
  fallbackHref = '/',
  className,
  ...buttonProps
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else if (fallbackHref) {
      router.push(fallbackHref)
    }
  }

  return (
    <Button
      type="button"
      variant={buttonProps.variant ?? 'ghost'}
      className={cn(
        'gap-2 transition-colors hover:bg-transparent hover:text-blue-900',
        className
      )}
      onClick={handleClick}
      aria-label="Go back"
      {...buttonProps}
    >
      {showIcon ? <ArrowLeft aria-hidden="true" /> : null}
      <span>{label}</span>
    </Button>
  )
}
