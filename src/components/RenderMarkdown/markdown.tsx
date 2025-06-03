import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import ReactMarkdown, { type Options as ReactMarkdownOptions } from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

import { Button } from '@/components/ui/button'
import { rehypeSplitWordsIntoSpans } from '@/core/rehype'
import { autoFixMarkdown } from '@/core/utils/markdown'
import { cn } from '@/lib/utils'

import { Tooltip } from '@/components/Tooltip'
import { CodeBlock } from '../ChatCodeBlock'

export function Markdown({
  className,
  children,
  style,
  enableCopy,
  animated = false,
  ...props
}: ReactMarkdownOptions & {
  className?: string
  enableCopy?: boolean
  style?: React.CSSProperties
  animated?: boolean
  checkLinkCredibility?: boolean
}) {
  const components: ReactMarkdownOptions['components'] = useMemo(() => {
    return {
      code: (props: any) => {
        const { className, children, ...rest } = props
        const match = /language-(\w+)/.exec(className || '')
        if (!match) {
          // 行内代码
          return (
            <code className={className} {...rest}>
              {children}
            </code>
          )
        }
        // 代码块
        return (
          <CodeBlock
            code={String(children).replace(/\n$/, '')}
            language={match ? match[1] : undefined}
            {...rest}
          />
        )
      }
    }
  }, [])

  const rehypePlugins = useMemo(() => {
    if (animated) {
      return [rehypeKatex, rehypeSplitWordsIntoSpans]
    }
    return [rehypeKatex]
  }, [animated])
  return (
    <div className={cn(className, 'prose dark:prose-invert')} style={style}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={rehypePlugins}
        {...props}
      >
        {autoFixMarkdown(dropMarkdownQuote(processKatexInMarkdown(children ?? '')) ?? '')}
      </ReactMarkdown>
      {enableCopy && typeof children === 'string' && (
        <div className="flex">
          <CopyButton content={children} />
        </div>
      )}
    </div>
  )
}

/**
 * @description 复制按钮
 * @param content
 * @returns
 */
function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Tooltip title="Copy">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, 1000)
          } catch (error) {
            console.error(error)
          }
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{' '}
      </Button>
    </Tooltip>
  )
}

/**
 * @description 处理 markdown 中的 katex 语法
 * @param markdown
 * @returns
 */
function processKatexInMarkdown(markdown?: string | null) {
  if (!markdown) return markdown

  const markdownWithKatexSyntax = markdown
    .replace(/\\\\\[/g, '$$$$') // Replace '\\[' with '$$'
    .replace(/\\\\\]/g, '$$$$') // Replace '\\]' with '$$'
    .replace(/\\\\\(/g, '$$$$') // Replace '\\(' with '$$'
    .replace(/\\\\\)/g, '$$$$') // Replace '\\)' with '$$'
    .replace(/\\\[/g, '$$$$') // Replace '\[' with '$$'
    .replace(/\\\]/g, '$$$$') // Replace '\]' with '$$'
    .replace(/\\\(/g, '$$$$') // Replace '\(' with '$$'
    .replace(/\\\)/g, '$$$$') // Replace '\)' with '$$';
  return markdownWithKatexSyntax
}

/**
 * @description 删除 markdown 中的代码块
 * @param markdown
 * @returns
 */
function dropMarkdownQuote(markdown?: string | null) {
  if (!markdown) return markdown
  return markdown
    .replace(/^```markdown\n/gm, '')
    .replace(/^```text\n/gm, '')
    .replace(/^```\n/gm, '')
    .replace(/\n```$/gm, '')
}
