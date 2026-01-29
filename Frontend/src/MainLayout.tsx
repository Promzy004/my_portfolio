// layouts/MainLayout.tsx
import { Outlet } from "react-router-dom"
import Navigation from "@/components/GlobalComponents/Navigation/Navigation"

interface Props {
  darkMode: boolean
}

const MainLayout: React.FC<Props> = ({ darkMode }) => {
  return (
    <>
      <Navigation darkMode={darkMode} />
      <Outlet />
    </>
  )
}

export default MainLayout
