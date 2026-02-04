import React, { useState } from "react"
import AdminSidebar from "./AdminSidebar"
import { useAuthStore } from "@/store/useAuthStore"

interface AdminLayoutProps {
  children: React.ReactNode
  darkMode: boolean
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, darkMode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const logout = useAuthStore((state) => state.logout)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

  return (
    <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="mr-64">
            <AdminSidebar
                darkMode={darkMode}
                onLogout={logout}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />
        </div>
      
        {/* Main Content */}
        <main className={`flex-1 ${darkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]"}`}>
            {/* Mobile Header */}
            <div
                className={`lg:hidden sticky top-0 z-30 border-b ${
                    darkMode
                    ? "bg-[#1A1A1A] border-[#333333]"
                    : "bg-white border-[#E5E5E5]"
                }`}
            >
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-xl font-bold" style={{ color: "#2B93E2" }}>
                        Admin Panel
                    </h1>
                    <button
                        onClick={toggleSidebar}
                        className={`p-2 rounded-lg transition-colors ${
                            darkMode
                            ? "hover:bg-[#2A2A2A] text-white"
                            : "hover:bg-[#F5F5F5] text-black"
                        }`}
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Page Content */}
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </main>
    </div>
  )
}

export default AdminLayout