import { useMemo } from 'react'
import katex from 'katex'
import MarkdownIt from 'markdown-it'
import markdownItTexMath from 'markdown-it-texmath'
import markdownitExternalLink from 'markdown-it-external-link'
import { Token } from 'markdown-it/index.js'

// 创建一个单例 MarkdownIt 实例
const createMarkdownInstance = () => {
  const md = new MarkdownIt({ html: true, breaks: true, linkify: true })

  md.use(markdownitExternalLink, {
    target: '_blank'
  })

  md.use(markdownItTexMath, {
    engine: katex,
    delimiters: 'brackets',
    katexOptions: {
      throwOnError: false,
      displayMode: false
    }
  })

  // 优化 fence 渲染规则
  md.renderer.rules.fence = (tokens: Token[], idx: number) => {
    const token = tokens[idx]
    // return `<div class="react-code-block" data-code="${encodeURIComponent(token.content)}" data-lang="${token.info.trim()}"></div>`
    return `<pre class='p-4 bg-gray-100 dark:bg-gray-800 rounded-md'><code class="language-${token.info.trim()}">${token.content}</code></pre>`
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
