import CV from "./pages/CV"
import Home from "./pages/Home"
import Docs from "./pages/Docs"
import About from "./pages/About"
import { useEffect, useState } from "react"
import WebProjects from "./pages/WebProjects"
import RouteChangeProgress from "./ProgressBar"
import {  Route, Routes } from "react-router-dom"
import MobileProjects from "./pages/MobileProjects"
import Navigation from "./components/GlobalComponents/Navigation/Navigation"
import ThemeToggleBtn from "./components/GlobalComponents/ThemeToggler/ThemeToggleBtn"

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
        {/* <Route path="/cv" element={<CV />} /> */}
        <Route path="/web-projects" element={<WebProjects darkMode={darkMode} />} />
        <Route path="/mobile-app-projects" element={<MobileProjects darkMode={darkMode} />} />
        <Route path="*" element={<div className="mt-[20vh] text-center flex flex-col gap-3 items-center">page not available or under development <br /> <a href="/" className="bg-primary py-1 px-3 text-white hover:scale-105 transition-all duration-300">Back to home page</a></div>} />
      </Routes>
    </div>
  )
}

export default App




