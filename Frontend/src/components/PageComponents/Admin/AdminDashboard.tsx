import React from "react"
import type { BlogPost } from "@/types/blog"
import type { Project, Skill, Social, Experience } from "@/types/admin-types"

interface AdminDashboardProps {
  darkMode: boolean
  blogs: BlogPost[]
  projects: Project[]
  skills: Skill[]
  socials: Social[]
  experiences: Experience[]
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  darkMode,
  blogs,
  projects,
  skills,
  socials,
  experiences,
}) => {
  const stats = [
    {
      label: "Blog Posts",
      value: blogs.length,
      icon: "📝",
      color: "#2B93E2",
    },
    {
      label: "Projects",
      value: projects.length,
      icon: "🚀",
      color: "#10B981",
    },
    {
      label: "Skills",
      value: skills.length,
      icon: "⚡",
      color: "#F59E0B",
    },
    {
      label: "Social Links",
      value: socials.length,
      icon: "🔗",
      color: "#8B5CF6",
    },
    {
      label: "Experience",
      value: experiences.length,
      icon: "💼",
      color: "#EF4444",
    },
  ]

  const recentBlogs = blogs.slice(0, 3)
  const recentProjects = projects.slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className={`text-sm sm:text-base ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-4 sm:p-6 rounded-xl transition-all hover:scale-105 ${
              darkMode ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-2xl sm:text-3xl">{stat.icon}</span>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <span className="text-lg sm:text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            </div>
            <h3 className={`text-xs sm:text-sm font-medium ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
              {stat.label}
            </h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Blogs */}
        <div
          className={`p-4 sm:p-6 rounded-xl ${
            darkMode ? "bg-[#1A1A1A]" : "bg-white"
          }`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Blog Posts</h2>
          {recentBlogs.length === 0 ? (
            <p className={`text-sm ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              No blog posts yet
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className={`p-3 sm:p-4 rounded-lg ${
                    darkMode ? "bg-[#0F0F0F]" : "bg-[#F9F9F9]"
                  }`}
                >
                  <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1">{blog.title}</h3>
                  <p
                    className={`text-xs sm:text-sm mb-2 line-clamp-2 ${
                      darkMode ? "text-[#CCCCCC]" : "text-[#666666]"
                    }`}
                  >
                    {blog.excerpt}
                  </p>
                  <span className={`text-xs ${darkMode ? "text-[#888888]" : "text-[#999999]"}`}>
                    {blog.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div
          className={`p-4 sm:p-6 rounded-xl ${
            darkMode ? "bg-[#1A1A1A]" : "bg-white"
          }`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <p className={`text-sm ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              No projects yet
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 sm:p-4 rounded-lg ${
                    darkMode ? "bg-[#0F0F0F]" : "bg-[#F9F9F9]"
                  }`}
                >
                  <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1">{project.name}</h3>
                  <p
                    className={`text-xs sm:text-sm mb-2 line-clamp-2 ${
                      darkMode ? "text-[#CCCCCC]" : "text-[#666666]"
                    }`}
                  >
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: "#2B93E2", color: "white" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <a
            href="/admin/blogs"
            className={`p-3 sm:p-4 rounded-xl transition-all hover:scale-105 text-center ${
              darkMode ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]" : "bg-white hover:bg-[#F9F9F9]"
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-2">📝</div>
            <p className="font-medium text-sm sm:text-base">Write Blog</p>
          </a>
          <a
            href="/admin/projects"
            className={`p-3 sm:p-4 rounded-xl transition-all hover:scale-105 text-center ${
              darkMode ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]" : "bg-white hover:bg-[#F9F9F9]"
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-2">🚀</div>
            <p className="font-medium text-sm sm:text-base">Add Project</p>
          </a>
          <a
            href="/admin/skills"
            className={`p-3 sm:p-4 rounded-xl transition-all hover:scale-105 text-center ${
              darkMode ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]" : "bg-white hover:bg-[#F9F9F9]"
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-2">⚡</div>
            <p className="font-medium text-sm sm:text-base">Add Skill</p>
          </a>
          <a
            href="/admin/experience"
            className={`p-3 sm:p-4 rounded-xl transition-all hover:scale-105 text-center ${
              darkMode ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]" : "bg-white hover:bg-[#F9F9F9]"
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-2">💼</div>
            <p className="font-medium text-sm sm:text-base">Add Experience</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard