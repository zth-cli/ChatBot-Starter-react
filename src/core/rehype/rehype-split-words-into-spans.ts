import type { Element, Root, ElementContent } from 'hast'
import { visit } from 'unist-util-visit'
import type { BuildVisitor } from 'unist-util-visit'

/**
 * @description 这个插件会让段落、标题等标签下的每个“词”都被 <span> 包裹，并且可以通过 animate-fade-in 这个 CSS 类实现动画效果，常用于逐字/逐词动画展示文本
 * - 遍历 AST 中的 element 类型节点；
 * - 若节点是 p, h1-h6, li, strong 之一，则处理其子节点；
 * - 将其中的文本节点按中文词语拆分（使用 Intl.Segmenter）；
 * - 每个词语包裹在带有 className="animate-fade-in" 的 <span> 中；
 * - 非文本子节点保持不变插入新结构中。
 */
export function rehypeSplitWordsIntoSpans() {
  return (tree: Root) => {
    visit(tree, 'element', ((node: Element) => {
      if (
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'strong'].includes(node.tagName) &&
        node.children
      ) {
        const newChildren: Array<ElementContent> = []
        node.children.forEach(child => {
          if (child.type === 'text') {
            const segmenter = new Intl.Segmenter('zh', { granularity: 'word' })
            const segments = segmenter.segment(child.value)
            const words = Array.from(segments)
              .map(segment => segment.segment)
              .filter(Boolean)
            words.forEach((word: string) => {
              newChildren.push({
                type: 'element',
                tagName: 'span',
                properties: {
                  className: 'animate-fade-in'
                },
                children: [{ type: 'text', value: word }]
              })
            })
          } else {
            newChildren.push(child)
          }
        })
        node.children = newChildren
      }
    }) as BuildVisitor<Root, 'element'>)
  }
}
