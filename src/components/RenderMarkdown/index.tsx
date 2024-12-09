import './style.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useLastTextPosition } from '@/hooks/useLastPosition'
import { useTextSelection } from '@/hooks/useTextSelection'
import { useCodeBlockMount } from '@/hooks/useCodeBlockMount'
import { useMarkdownRenderer } from '@/hooks/useMarkdownRenderer'

interface RenderMarkdownProps {
  id?: string
  unstyle?: boolean
  data?: string | object
  maxHeight?: number
  loading?: boolean
}

export const RenderMarkdown: React.FC<RenderMarkdownProps> = ({
  id = '',
  unstyle = false,
  data = '',
  maxHeight = 0,
  loading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const { md } = useMarkdownRenderer()
  const { getSelectionInfo, setSelectionByInfo } = useTextSelection(containerRef)
  const { mountCodeBlocks } = useCodeBlockMount(containerRef)
  const { position } = useLastTextPosition(containerRef)

  let lastContent = ''

  const updateContent = async () => {
    if (!containerRef.current) return

    const selectionInfo = getSelectionInfo()

    if (unstyle) {
      if (lastContent !== data) {
        containerRef.current.textContent = data as string
        lastContent = data as string
      }
    } else {
      if (typeof data !== 'string') {
        containerRef.current.innerHTML = JSON.stringify(data, null, 2)
        lastContent = JSON.stringify(data)
      } else {
        const html = md.render(data)
        if (lastContent !== html) {
          containerRef.current.innerHTML = html
          lastContent = html
          // mountCodeBlocks()
        }
      }
    }

    if (selectionInfo) {
      setSelectionByInfo(selectionInfo)
    }

    if (maxHeight && containerRef.current) {
      setHasOverflow(containerRef.current.scrollHeight > maxHeight)
    }
  }

  useEffect(() => {
    updateContent()
  }, [data, unstyle, maxHeight])

  return (
    <div className="relative">
      <div className="relative">
        <div
          ref={containerRef}
          id={`md_container_${id}`}
          className="md_container text-black/85 dark:text-foreground text-sm sm:text-base tracking-wide leading-normal sm:leading-7"
          style={{
            whiteSpace: unstyle ? 'pre-wrap' : 'normal',
            wordWrap: unstyle ? 'break-word' : 'normal',
            maxHeight: maxHeight && !isExpanded ? `${maxHeight}px` : undefined,
            overflow: maxHeight && !isExpanded ? 'hidden' : undefined
          }}
        />
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

      {hasOverflow && !isExpanded && (
        <div className="absolute bottom-[30px] left-0 w-full h-[4em] bg-gradient-to-b from-transparent to-background pointer-events-none" />
      )}
      {hasOverflow && (
        <div className="text-center mt-2">
          <button
            className="text-primary hover:text-primary/80"
            onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '收起' : '展开更多'}
          </button>
        </div>
      )}
    </div>
  )
}
