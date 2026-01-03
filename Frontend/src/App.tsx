import { useEffect, useState } from "react"
import {  Route, Routes } from "react-router-dom"
import Home from "./components/pages/Home"
import About from "./components/pages/About"
import RouteChangeProgress from "./ProgressBar"
import Navigation from "./components/GlobalComponents/Navigation/Navigation"
import Docs from "./components/pages/Docs"
import CV from "./components/pages/CV"
import ThemeToggleBtn from "./components/GlobalComponents/ThemeToggler/ThemeToggleBtn"
import DevelopmentProjects from "./components/pages/DevelopmentProjects"
import DesignProjects from "./components/pages/DesignProjects"

function App () {
  const [ darkMode, setDarkMode ] = useState<boolean>(false)


  useEffect(() => {
    const userTheme = localStorage.getItem('theme')

    if (userTheme === 'dark') {
      setDarkMode(true)
    } else if (userTheme === 'light') {
      setDarkMode(false)
    } else {
      const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log(deviceTheme)
      setDarkMode(deviceTheme)
    }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if(darkMode) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode]);

  return (
    <div className="relative font-mullish flex flex-col items-center gap-10 xs:gap-12 bg-[#F8F2F2] text-[#090909] dark:bg-[#090909] dark:text-[#FAFAFA] min-h-screen">
      <Navigation darkMode={darkMode} />
      <RouteChangeProgress />
      <ThemeToggleBtn darkMode={darkMode} setDarkMode={setDarkMode} />

      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-docs" element={<Docs />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/development" element={<DevelopmentProjects darkMode={darkMode} />} />
        <Route path="/design" element={<DesignProjects darkMode={darkMode} />} />
        <Route path="*" element={<div>page not found</div>} />
      </Routes>
    </div>
  )
}

export default App




