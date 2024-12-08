import { useRef, useLayoutEffect, createElement } from 'react' // 改用 useLayoutEffect
import { createRoot } from 'react-dom/client'
import { CodeBlock } from '@/components/ChatCodeBlock'

export function useCodeBlockMount(
  containerRef: React.RefObject<HTMLElement>,
  className = '.react-code-block'
) {
  const mountedRoots = useRef<Array<{ root: any; el: HTMLElement }>>([])
  const lastContentRef = useRef<string>('')
  const cleanupScheduled = useRef<number>()
  const isMounting = useRef(false)

  const cleanupMountedRoots = () => {
    if (cleanupScheduled.current) {
      window.cancelAnimationFrame(cleanupScheduled.current)
    }

    if (isMounting.current) return

    cleanupScheduled.current = window.requestAnimationFrame(() => {
      mountedRoots.current.forEach(({ root, el }) => {
        try {
          root.unmount()
          el.remove()
        } catch (e) {
          console.error('清理代码块时出错:', e)
        }
      })
      mountedRoots.current = []
    })
  }

  const mountCodeBlocks = () => {
    if (!containerRef.current) return

    const currentContent = containerRef.current.innerHTML
    if (currentContent === lastContentRef.current) {
      return
    }

    lastContentRef.current = currentContent

    // 标记正在挂载
    isMounting.current = true
    cleanupMountedRoots()

    window.requestAnimationFrame(() => {
      if (!containerRef.current) return

      try {
        const codeBlocks = containerRef.current.querySelectorAll(className)
        codeBlocks.forEach(block => {
          const code = decodeURIComponent(block.getAttribute('data-code') || '')
          const lang = block.getAttribute('data-lang') || ''

          const mountEl = document.createElement('div')
          const root = createRoot(mountEl)

          root.render(createElement(CodeBlock, { code, language: lang }))
          block.replaceWith(mountEl)

          mountedRoots.current.push({
            root,
            el: mountEl
          })
        })
      } catch (e) {
        console.error('挂载代码块时出错:', e)
      } finally {
        isMounting.current = false
      }
    })
  }

  // 使用 useLayoutEffect 处理清理
  useLayoutEffect(() => {
    return () => {
      if (cleanupScheduled.current) {
        window.cancelAnimationFrame(cleanupScheduled.current)
      }

      // 使用 Promise.resolve() 将清理推迟到下一个微任务
      Promise.resolve().then(() => {
        mountedRoots.current.forEach(({ root, el }) => {
          try {
            root.unmount()
            el.remove()
          } catch (e) {
            console.error('组件卸载时清理出错:', e)
          }
        })
        mountedRoots.current = []
      })
    }
  }, [])

  return {
    mountCodeBlocks,
    cleanupMountedRoots
  }
}
