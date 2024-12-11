import React, { useMemo } from 'react'
import './style.scss'
import { useLastTextPosition } from '@/hooks/useLastPosition'
import { useMarkdownRenderer } from '@/hooks/useMarkdownRenderer'
import { CodeBlock } from '@/components/ChatCodeBlock'

interface MarkdownParserProps {
  id?: string
  markdown: string
  loading: boolean
}

const RenderMarkdown: React.FC<MarkdownParserProps> = ({ markdown, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { md } = useMarkdownRenderer()
  const { position } = useLastTextPosition(containerRef)
  const parsedContent = useMemo(() => {
    const parsed = md.render(markdown)
    return parsed
      .split(/(<CodeBlock-.*?>)/)
      .filter(Boolean)
      .map((part, index) => {
        if (part.startsWith('<CodeBlock-')) {
          const match = part.match(/<CodeBlock-(.*?)-(.*)>/)
          if (!match) {
            console.warn('Invalid CodeBlock format:', part)
            return null
          }
          const [, language, encodedCode] = match
          const code = decodeURIComponent(encodedCode)
          return <CodeBlock key={index} language={language} code={code} />
        }
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
      })
      .filter(Boolean)
  }, [markdown, md])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="md_container text-black/85 dark:text-foreground text-sm sm:text-base tracking-wide leading-normal sm:leading-7">
        {parsedContent}
      </div>
      {loading && (
        <span
          className="absolute h-2 w-2 rounded-full animate-pulse-dark-light"
          style={{
            top: `${(position?.y || 0) + 6}px`,
            left: `${position?.x || 0}px`
          }}
        />
      )}
    </div>
  )
}

export default RenderMarkdown
