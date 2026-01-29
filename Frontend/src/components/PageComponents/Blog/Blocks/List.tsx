import React from "react"

interface ListProps {
  items?: string[]
  darkMode: boolean
}

const List: React.FC<ListProps> = ({ items = [], darkMode }) => {
  return (
    <ul className={`list-disc pl-6 leading-7 ${darkMode ? "text-[#CCCCCC]" : "text-[#555555]"}`}>
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  )
}


export default List
