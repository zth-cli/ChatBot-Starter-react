import { useState, useEffect, useRef } from 'react'
import { initHighlighter } from '@/lib/singletonShiki'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy } from '@/components/Copy'
import './style.scss'
import { SquareTerminal, ChevronDown, ChevronUp } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string | null
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = null }) => {
  const isDark = false
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const highlightedCodeRef = useRef<HTMLElement>(null)

  const highlightCode = async () => {
    try {
      setIsLoading(true)
      const highlighter = await initHighlighter()
      const theme = isDark ? 'github-dark' : 'github-light' // 假设isDark是从主题context中获取的

      const html = highlighter.codeToHtml(code, {
        lang: language || 'bash',
        theme
      })

      if (highlightedCodeRef.current) {
        highlightedCodeRef.current.innerHTML = html
      }
    } catch (err) {
      console.error('Failed to highlight:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    highlightCode()
  }, [code, language, isDark]) // 依赖项更新时重新高亮

  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <>
      <div
        className="border rounded-lg inline-block px-2 leading-7 text-sm cursor-pointer mt-1 select-none"
        onClick={toggleExpand}>
        {isExpanded ? '收起' : '展开'}
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 inline ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 inline ml-1" />
        )}
      </div>
      <div className="code-block-wrapper" style={{ display: isExpanded ? 'block' : 'none' }}>
        <div className="code-block-header">
          <span className="language-label">
            <SquareTerminal className="h-4 w-4 mr-1" />
            {language ?? ''}
          </span>
          <Copy content={code} showText={true} />
        </div>
        {isLoading && (
          <div className="flex items-center space-x-4 p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
        <pre className={`code-block ${isLoading ? 'hidden' : ''}`}>
          <code ref={highlightedCodeRef} className={language ? `language-${language}` : ''} />
        </pre>
      </div>
    </>
  )
}
