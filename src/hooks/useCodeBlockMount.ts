import { useRef, useEffect, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CodeBlock } from '@/components/ChatCodeBlock'

interface MountedRoot {
  root: Root
  el: HTMLElement
}

export function useCodeBlockMount(
  containerRef: React.RefObject<HTMLElement | null>,
  className = '.react-code-block'
) {
  const mountedRoots = useRef<MountedRoot[]>([])
  const pendingMounts = useRef<MountedRoot[]>([])

  const cleanupMountedRoots = () => {
    mountedRoots.current.forEach(({ root, el }) => {
      try {
        root.unmount()
        el.remove()
      } catch (error) {
        console.error('清理 root 时出错:', error)
      }
    })
    mountedRoots.current = []
  }

  const mountCodeBlocks = () => {
    if (!containerRef.current) return

    // 清理之前的实例
    cleanupMountedRoots()

    const codeBlocks = containerRef.current.querySelectorAll(className)
    codeBlocks.forEach(block => {
      const code = decodeURIComponent(block.getAttribute('data-code') || '')
      const lang = block.getAttribute('data-lang') || ''

      const mountEl = document.createElement('div')
      mountEl.setAttribute('data-code', lang)

      // 先将挂载元素添加到 DOM 中
      block.replaceWith(mountEl)

      const root = createRoot(mountEl)

      // 使用 requestAnimationFrame 确保在下一帧渲染
      requestAnimationFrame(() => {
        root.render(
          createElement(CodeBlock, {
            code,
            language: lang
          })
        )

        // 将新创建的 root 添加到 pendingMounts
        pendingMounts.current.push({
          root,
          el: mountEl
        })
      })
    })

    // 使用 requestAnimationFrame 在下一帧更新 mountedRoots
    requestAnimationFrame(() => {
      mountedRoots.current = [...pendingMounts.current]
      pendingMounts.current = []
    })
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupMountedRoots()
    }
  }, [])

  return {
    mountCodeBlocks,
    cleanupMountedRoots
  }
}
