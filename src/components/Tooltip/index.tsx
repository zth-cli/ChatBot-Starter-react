import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CSSProperties } from 'react'

export function Tooltip({
  className,
  style,
  children,
  title,
  open,
  side,
  sideOffset,
  delayDuration = 750
}: {
  className?: string
  style?: CSSProperties
  children: React.ReactNode
  title?: React.ReactNode
  open?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
  sideOffset?: number
  delayDuration?: number
}) {
  return (
    <TooltipProvider>
      <ShadcnTooltip delayDuration={delayDuration} open={open}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={cn(className)} style={style} side={side} sideOffset={sideOffset}>
          {title}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  )
}
