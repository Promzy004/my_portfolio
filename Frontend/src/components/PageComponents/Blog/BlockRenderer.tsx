import React from "react"
import Paragraph from "./Blocks/Paragraph"
import Heading from "./Blocks/Heading"
import List from "./Blocks/List"
import CodeBlock from "./Blocks/CodeBlock"
import Callout from "./Blocks/CallOut"
import type { BlogBlock } from "@/types/blog"

interface BlockRendererProps {
  block: BlogBlock
  darkMode: boolean
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, darkMode }) => {
  switch (block.type) {
    case "paragraph":
      return <Paragraph text={block.data.text} darkMode={darkMode} />
    case "heading":
      return <Heading level={block.data.level ?? 2} text={block.data.text} darkMode={darkMode} />
    case "list":
      return <List items={block.data.items} darkMode={darkMode} />
    case "code":
      return <CodeBlock code={block.data.code} language={block.data.language} darkMode={darkMode} />
    case "callout":
      return <Callout text={block.data.text} darkMode={darkMode} />
    default:
      return null
  }
}

export default BlockRenderer