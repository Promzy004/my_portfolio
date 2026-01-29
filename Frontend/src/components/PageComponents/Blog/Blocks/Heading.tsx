import React from "react"

interface HeadingProps {
  text?: string
  level?: 2 | 3
  darkMode: boolean
}

const Heading: React.FC<HeadingProps> = ({ text = "", level = 2, darkMode }) => {
  return React.createElement(
    `h${level}`,
    {
      className: `font-bold mt-6 mb-3 ${darkMode ? "text-white" : "text-black"}`
    },
    text
  )
}

export default Heading