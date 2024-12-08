import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface SuggestMessageItemProps {
  content: string
  onClick?: () => void
}

export const SuggestMessageItem: React.FC<SuggestMessageItemProps> = ({ content, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-black/5 dark:bg-neutral-900',
        'hover:bg-black/10 dark:hover:bg-neutral-800',
        'text-black/85 dark:text-foreground',
        'flex items-center h-fit gap-1 w-fit',
        'rounded-xl py-2 pl-4 pr-[10px] cursor-pointer'
      )}>
      <span className="text-sm flex-1">{content}</span>
      <ArrowRight className="w-4 h-4" />
    </div>
  )
}
