import { RefObject } from 'react'

interface SelectionInfo {
  text: string
  startOffset: number
  endOffset: number
}

export function useTextSelection(containerRef: RefObject<HTMLElement>) {
  const getSelectionInfo = (): SelectionInfo | null => {
    const selection = window.getSelection()
    if (!selection || !containerRef.current?.contains(selection.anchorNode)) {
      return null
    }

    const range = selection.getRangeAt(0)
    const preSelectionRange = range.cloneRange()
    preSelectionRange.selectNodeContents(containerRef.current)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    const startOffset = preSelectionRange.toString().length

    return {
      text: selection.toString(),
      startOffset,
      endOffset: startOffset + range.toString().length
    }
  }

  const setSelectionByInfo = (info: SelectionInfo) => {
    if (!info || !containerRef.current) {
      return
    }

    const textNodes: Node[] = []
    const walk = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT, null)
    let node: Node | null
    while ((node = walk.nextNode())) {
      textNodes.push(node)
    }

    let currentOffset = 0
    let startNode: Node | null = null
    let endNode: Node | null = null
    let startNodeOffset = 0
    let endNodeOffset = 0

    for (const node of textNodes) {
      const nodeLength = node.textContent?.length || 0

      if (!startNode && currentOffset + nodeLength > info.startOffset) {
        startNode = node
        startNodeOffset = info.startOffset - currentOffset
      }

      if (!endNode && currentOffset + nodeLength >= info.endOffset) {
        endNode = node
        endNodeOffset = info.endOffset - currentOffset
        break
      }

      currentOffset += nodeLength
    }

    if (startNode && endNode) {
      const range = document.createRange()
      range.setStart(startNode, startNodeOffset)
      range.setEnd(endNode, endNodeOffset)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  return {
    getSelectionInfo,
    setSelectionByInfo
  }
}
