import React from "react"

interface CalloutProps {
  text?: string
  darkMode: boolean
}

const Callout: React.FC<CalloutProps> = ({ text = "", darkMode }) => {
  return (
    <div
      className={`border-l-4 p-4 my-4 ${
        darkMode ? "border-[#2B93E2] bg-[#1F1F1F] text-white" : "border-[#2B93E2] bg-[#E0F0FF] text-black"
      }`}
    >
      {text}
    </div>
  )
}


export default Callout
