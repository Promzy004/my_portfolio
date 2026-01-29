import React from "react"
import { Link, useLocation } from "react-router-dom"

interface AdminSidebarProps {
  darkMode: boolean
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ darkMode, onLogout, isOpen, onClose }) => {
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

  // Handle link click - close sidebar on mobile
  const handleLinkClick = () => {
    // Only close on mobile (when sidebar is overlay)
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 min-h-screen border-r
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${darkMode ? "bg-[#1A1A1A] border-[#333333]" : "bg-white border-[#E5E5E5]"}
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b" style={{ borderColor: darkMode ? "#333333" : "#E5E5E5" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#2B93E2" }}>
                Admin Panel
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
                Portfolio Manager
              </p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
            >
              <svg
                className={darkMode ? "text-white" : "text-black"}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 pb-24">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
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
    </>
  )
}

export default AdminSidebar