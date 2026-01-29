import { Route, Routes } from "react-router-dom"
import RouteChangeProgress from "./ProgressBar"
import { lazy, Suspense, useEffect, useState } from "react"
import ThemeToggleBtn from "./components/GlobalComponents/ThemeToggler/ThemeToggleBtn"
import Blog from "@/pages/Blog"
import BlogDetails from "./pages/BlogDetails"
import Admin from "./pages/Admin"
import MainLayout from "./MainLayout"

// Lazy load all pages (except critical ones if needed)
const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./pages/About"))
const WebProjects = lazy(() => import("./pages/WebProjects"))
const MobileProjects = lazy(() => import("./pages/MobileProjects"))
const CV = lazy(() => import("./pages/CV"))

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
      <RouteChangeProgress />
      <ThemeToggleBtn darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="w-full flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-xl font-semibold animate-pulse">Loading...</div>
          </div>
        }>
          <Routes>

            {/* main layout adds navigation to these routes */}
            <Route element={<MainLayout darkMode={darkMode} />}>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/my-docs" element={<Docs />} /> */}
              <Route path="/web-projects" element={<WebProjects darkMode={darkMode} />} />
              <Route path="/mobile-app-projects" element={<MobileProjects darkMode={darkMode} />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/blog" element={<Blog darkMode={darkMode} />} />
              <Route path="/blog/:slug" element={<BlogDetails darkMode={darkMode} />} />
              <Route path="*" element={
                <div className="mt-[20vh] text-center flex flex-col gap-3 items-center">
                  page not available or under development <br /> 
                  <a href="/" className="bg-primary py-1 px-3 text-white hover:scale-105 transition-all duration-300">
                    Back to home page
                  </a>
                </div>
              } />
            </Route>

            <Route path="/admin/*" element={<Admin darkMode={darkMode} />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App