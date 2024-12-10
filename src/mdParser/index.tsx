import React, { useState, useEffect } from 'react'
import MarkdownParser from './MarkdownParser'

const Home: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string>('')

  useEffect(() => {
    const mockMarkdownStream = new ReadableStream({
      start(controller) {
        const content = [
          '# Hello World\n\n',
          'This is a paragraph.\n\n',
          '\`\`\`javascript\n',
          "console.log('Hello, World!');\n",
          '\`\`\`\n\n',
          '\`\`\`javascript\n',
          "console.log('Hello, World!');\n",
          '\`\`\`\n\n',
          'Another paragraph.'
        ]

        let index = 0
        const interval = setInterval(() => {
          if (index < content.length) {
            controller.enqueue(content[index])
            index++
          } else {
            clearInterval(interval)
            controller.close()
          }
        }, 1000)
      }
    })

    const reader = mockMarkdownStream.getReader()
    let accumulatedContent = ''

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          accumulatedContent += value
          setMarkdownContent(accumulatedContent)
        }
      } finally {
        reader.releaseLock()
      }
    }

    processStream()

    return () => {
      reader.cancel()
    }
  }, [])

  return (
    <div>
      <h1>Markdown Parser Demo</h1>
      <MarkdownParser markdown={markdownContent} />
    </div>
  )
}

export default Home
