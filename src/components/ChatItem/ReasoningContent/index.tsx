import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react'
import { useState } from 'react'
export interface ReasoningContentProps {
  content: string
}
export default function ReasoningContent({ content }: ReasoningContentProps) {
  const [isOpen, setIsOpen] = useState(true)
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="w-full sm:max-w-full md:max-w-2xl lg:max-w-5xl xl:max-w-7xl flex flex-col gap-2 mb-2">
      <div
        onClick={handleToggle}
        className="w-32 h-8 inline-flex justify-between cursor-pointer items-center px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
        <Sparkles className="size-4" />
        <span>思考过程</span>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </div>
      {isOpen && (
        <div className="px-4 border-l-2 text-sm leading-6 text-muted-foreground">{content}</div>
      )}
    </div>
  )
}
