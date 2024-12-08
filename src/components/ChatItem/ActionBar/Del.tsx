import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DelProps {
  title?: string
  onClick?: () => void
}
export const Del: React.FC<DelProps> = ({ title, onClick }) => {
  return (
    <div className="flex items-center cursor-pointer flex-1 text-red-500" onClick={onClick}>
      <Trash2 className={cn('h-4 w-4')} />
      {title && <span className="ml-2">{title}</span>}
    </div>
  )
}
