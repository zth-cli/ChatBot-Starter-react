import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'

interface FloatButtonProps {
  title?: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}

export const FloatButton = ({
  title = '回到顶部',
  children,
  onClick,
  ...props
}: FloatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="icon"
      title={title}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full shadow-md"
      {...props}>
      {children || <ArrowDown className="w-5 h-5 stroke-primary" />}
    </Button>
  )
}
