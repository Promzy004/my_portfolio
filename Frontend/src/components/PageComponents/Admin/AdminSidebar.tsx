import React from "react"
import { Link, useLocation } from "react-router-dom"

interface AdminSidebarProps {
  darkMode: boolean
  onLogout: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ darkMode, onLogout }) => {
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Blogs", path: "/admin/blogs", icon: "📝" },
    { name: "Projects", path: "/admin/projects", icon: "🚀" },
    { name: "Skills", path: "/admin/skills", icon: "⚡" },
    { name: "Experience", path: "/admin/experience", icon: "💼" },
    { name: "Socials", path: "/admin/socials", icon: "🔗" },
  ]

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`w-64 min-h-screen border-r ${
        darkMode
          ? "bg-[#1A1A1A] border-[#333333]"
          : "bg-white border-[#E5E5E5]"
      }`}
    >
      {/* Logo/Header */}
      <div className="p-6 border-b" style={{ borderColor: darkMode ? "#333333" : "#E5E5E5" }}>
        <h1 className="text-2xl font-bold" style={{ color: "#2B93E2" }}>
          Admin Panel
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
          Portfolio Manager
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? darkMode
                      ? "bg-[#2B93E2] text-white"
                      : "bg-[#2B93E2] text-white"
                    : darkMode
                    ? "text-[#CCCCCC] hover:bg-[#2A2A2A]"
                    : "text-[#666666] hover:bg-[#F5F5F5]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-64 p-4 border-t" style={{ borderColor: darkMode ? "#333333" : "#E5E5E5" }}>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            darkMode
              ? "text-[#FF6B6B] hover:bg-[#2A2A2A]"
              : "text-[#FF6B6B] hover:bg-[#F5F5F5]"
          }`}
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar