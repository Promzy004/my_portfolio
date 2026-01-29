import React from "react"

interface CodeBlockProps {
  code?: string
  language?: string
  darkMode: boolean
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code = "", darkMode }) => {
  return (
    <pre
      className={`rounded-md p-4 overflow-x-auto ${
        darkMode ? "bg-[#1E1E1E] text-[#D4D4D4]" : "bg-[#F5F5F5] text-[#111111]"
      }`}
    >
      <code>{code}</code>
    </pre>
  )
}


export default CodeBlock
