import React from "react"

interface ParagraphProps {
  text?: string
  darkMode: boolean
}

const Paragraph: React.FC<ParagraphProps> = ({ text = "", darkMode }) => {
  return (
    <p className={`leading-7 ${darkMode ? "text-[#CCCCCC]" : "text-[#555555]"}`}>
      {text}
    </p>
  )
}


export default Paragraph
