import React from "react"
import light_active from "../../../assets/svg/light-active.svg"
import dark_active from "../../../assets/svg/dark-active.svg"
import light_not_active from "../../../assets/svg/light-not-active.svg"
import dark_not_active from "../../../assets/svg/dark-not-active.svg"

interface ToggleBtnProps {
  darkMode: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

const ThemeToggleBtn: React.FC<ToggleBtnProps> = ({ darkMode, setDarkMode }) => {

  return (
    <div 
      className="flex items-center gap-2 z-[9999] fixed bottom-[70px] xs:bottom-[100px] right-5 xs:right-8 rounded-full w-max px-1 border bg-[#EAEAEA33] border-[#44444433] dark:bg-[#FFFFFF1A] dark:border-[#FFFFFF33] backdrop-blur-md"
      style={{
        boxShadow: darkMode
          ? "-4px -4px 4px 0 rgba(255, 255, 255, 0.05) inset, 4px 4px 4px 0 rgba(255, 255, 255, 0.05) inset" 
          : "-4px -4px 4px 0 rgba(0, 0, 0, 0.05) inset, 4px 4px 4px 0 rgba(0, 0, 0, 0.05) inset"
      }}
    >
      <div className="flex items-center gap-2 relative w-full ">
        {/* Sliding Background Circle */}
        <div 
          className={`absolute top-1 left-1 w-8 h-[calc(100%-8px)] rounded-full transition-transform duration-300 ease-in-out ${
            darkMode ? 'bg-[#191919]' : 'bg-[#fff]'
          }`}
          style={{
            transform: darkMode ? 'translateX(calc(100% + 16px))' : 'translateX(0)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />

        {/* Light Mode Button */}
        <button 
          onClick={() => setDarkMode(false)}
          className="relative z-10 p-2 w-10 h-10 flex items-center justify-center transition-all duration-300"
          aria-label="Switch to light mode"
        >
          <img 
            src={!darkMode ? light_active : light_not_active} 
            alt="Light mode" 
            className="w-6 h-6"
          />
        </button>

        {/* Dark Mode Button */}
        <button 
          onClick={() => setDarkMode(true)}
          className="relative z-10 p-2 w-10 h-10 flex items-center justify-center transition-all duration-300"
          aria-label="Switch to dark mode"
        >
          <img 
            src={darkMode ? dark_active : dark_not_active} 
            alt="Dark mode" 
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  )
}

export default ThemeToggleBtn;