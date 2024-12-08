import { cn } from '@/lib'
import { Clipboard, ClipboardCheck } from 'lucide-react'
import useClipboard from 'react-use-clipboard'

interface CopyProps {
  content: string
  showText?: boolean
}

export const Copy: React.FC<CopyProps> = ({ content, showText = false }) => {
  const [isCopied, setCopied] = useClipboard(content, {
    successDuration: 2000
  })

  const CopyIcon = isCopied ? ClipboardCheck : Clipboard

  return (
    <div onClick={setCopied} className="flex items-center cursor-pointer">
      <CopyIcon className={cn('h-4 w-4', isCopied && 'stroke-primary')} />
      {showText && <span className="ml-2 text-sm">{isCopied ? '成功' : '复制'}</span>}
    </div>
  )
}
