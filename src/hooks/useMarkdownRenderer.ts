import { useMemo } from 'react'
import katex from 'katex'
import MarkdownIt from 'markdown-it'
import markdownItTexMath from 'markdown-it-texmath'
import markdownitExternalLink from 'markdown-it-external-link'

interface MarkdownConfig {
  html: boolean
  breaks: boolean
  linkify: boolean
  externalLink: {
    target: string
  }
  katexOptions: {
    throwOnError: boolean
    displayMode: boolean
  }
}

const DEFAULT_CONFIG: MarkdownConfig = {
  html: true,
  breaks: true,
  linkify: true,
  externalLink: {
    target: '_blank'
  },
  katexOptions: {
    throwOnError: false,
    displayMode: false
  }
}
// 创建一个单例 MarkdownIt 实例
const createMarkdownInstance = (config: MarkdownConfig = DEFAULT_CONFIG) => {
  const md = new MarkdownIt({
    html: config.html,
    breaks: config.breaks,
    linkify: config.linkify
  })

  md.use(markdownitExternalLink, config.externalLink)
  md.use(markdownItTexMath, {
    engine: katex,
    delimiters: 'brackets',
    katexOptions: config.katexOptions
  })
  // 自定义处理的代码块渲染
  md.renderer.rules.fence = (tokens, idx) => {
    try {
      const token = tokens[idx]
      const code = token.content.trim() || 'plaintext'
      const language = token.info.trim()

      return `<CodeBlock-${language}-${encodeURIComponent(code)}>`
    } catch (error) {
      console.error('Error rendering code block:', error)
      return '<CodeBlock-plaintext-代码块渲染错误>'
    }
  }

  return md
}

// 缓存 MarkdownIt 实例
const mdInstance = createMarkdownInstance()

export function useMarkdownRenderer() {
  // 使用 useMemo 缓存实例
  const md = useMemo(() => mdInstance, [])

  return { md }
}
export type { MarkdownConfig }
