import React from "react"
import AdminSidebar from "./AdminSidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  darkMode: boolean
  onLogout: () => void
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, darkMode, onLogout }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar darkMode={darkMode} onLogout={onLogout} />
      
      <main
        className={`flex-1 ${
          darkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]"
        }`}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout