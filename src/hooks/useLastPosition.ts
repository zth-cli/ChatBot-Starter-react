import { useState, useEffect, RefObject } from 'react'

interface Position {
  x: number
  y: number
}

export function useLastTextPosition(containerRef: RefObject<HTMLElement>) {
  const [position, setPosition] = useState<Position | null>(null)

  // 递归查找最后一个文本节点
  const findLastTextNode = (node: Node): Text | null => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length) {
      return node as Text
    }

    const children = Array.from(node.childNodes)
    for (let i = children.length - 1; i >= 0; i--) {
      const textNode = findLastTextNode(children[i])
      if (textNode) {
        return textNode
      }
    }

    return null
  }

  const updatePosition = () => {
    try {
      const div = containerRef.current
      if (!div) return

      const divRect = div.getBoundingClientRect()
      const range = document.createRange()

      const lastTextNode = findLastTextNode(div)
      if (!lastTextNode || lastTextNode.length === 0) {
        setPosition(null)
        return
      }

      range.setStart(lastTextNode, lastTextNode.length - 1)
      range.setEnd(lastTextNode, lastTextNode.length)

      const rects = range.getClientRects()

      if (rects.length > 0) {
        const lastRect = rects[rects.length - 1]
        setPosition({
          x: lastRect.right - divRect.left + div.scrollLeft,
          y: lastRect.top - divRect.top + div.scrollTop,
        })
      } else {
        setPosition(null)
      }
    } catch (error) {
      console.error('Error updating position:', error)
      setPosition(null)
    }
  }

  useEffect(() => {
    try {
      updatePosition()

      const observer = new MutationObserver(() => {
        requestAnimationFrame(updatePosition)
      })

      if (containerRef.current) {
        observer.observe(containerRef.current, {
          childList: true,
          characterData: true,
          subtree: true,
        })
      }

      return () => observer.disconnect()
    } catch (error) {
      console.error('Error in effect:', error)
    }
  }, [])

  return {
    position,
    updatePosition,
  }
} 