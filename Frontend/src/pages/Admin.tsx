import React, { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminLogin from "@/components/PageComponents/Admin/AdminLogin"
import AdminLayout from "@/components/PageComponents/Admin/AdminLayout"
import AdminDashboard from "@/components/PageComponents/Admin/AdminDashboard"
import BlogsManager from "@/components/PageComponents/Admin/BlogsManager"
import ProjectsManager from "@/components/PageComponents/Admin/ProjectsManager"
import SkillsManager from "@/components/PageComponents/Admin/SkillsManager"
import SocialsManager from "@/components/PageComponents/Admin/SocialsManager"
import ExperienceManager from "@/components/PageComponents/Admin/ExperienceManager"
import { blogData } from "@/data/BlogData"
import type { BlogPost } from "@/types/blog"
import type { Project, Skill, Social, Experience } from "@/types/admin-types"

interface AdminProps {
  darkMode: boolean
}

const Admin: React.FC<AdminProps> = ({ darkMode }) => {
  // Authentication state (will be connected to backend later)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Data state (will be connected to backend later)
  const [blogs, setBlogs] = useState<BlogPost[]>(blogData)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [socials, setSocials] = useState<Social[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    // TODO: Connect to backend authentication
    // For now, just simulate login
    console.log("Login attempt:", email, password)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    // TODO: Clear authentication tokens
  }

  // Blog handlers
  const handleSaveBlog = (blog: BlogPost) => {
    const existingIndex = blogs.findIndex(b => b.id === blog.id)
    if (existingIndex >= 0) {
      // Update existing
      const updatedBlogs = [...blogs]
      updatedBlogs[existingIndex] = blog
      setBlogs(updatedBlogs)
    } else {
      // Add new
      setBlogs([...blogs, blog])
    }
    // TODO: Sync with backend
  }

  const handleDeleteBlog = (id: string) => {
    setBlogs(blogs.filter(b => b.id !== id))
    // TODO: Sync with backend
  }

  // Project handlers
  const handleSaveProject = (project: Project) => {
    const existingIndex = projects.findIndex(p => p.id === project.id)
    if (existingIndex >= 0) {
      const updatedProjects = [...projects]
      updatedProjects[existingIndex] = project
      setProjects(updatedProjects)
    } else {
      setProjects([...projects, project])
    }
    // TODO: Sync with backend
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id))
    // TODO: Sync with backend
  }

  // Skill handlers
  const handleSaveSkill = (skill: Skill) => {
    const existingIndex = skills.findIndex(s => s.id === skill.id)
    if (existingIndex >= 0) {
      const updatedSkills = [...skills]
      updatedSkills[existingIndex] = skill
      setSkills(updatedSkills)
    } else {
      setSkills([...skills, skill])
    }
    // TODO: Sync with backend
  }

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id))
    // TODO: Sync with backend
  }

  // Social handlers
  const handleSaveSocial = (social: Social) => {
    const existingIndex = socials.findIndex(s => s.id === social.id)
    if (existingIndex >= 0) {
      const updatedSocials = [...socials]
      updatedSocials[existingIndex] = social
      setSocials(updatedSocials)
    } else {
      setSocials([...socials, social])
    }
    // TODO: Sync with backend
  }

  const handleDeleteSocial = (id: string) => {
    setSocials(socials.filter(s => s.id !== id))
    // TODO: Sync with backend
  }

  // Experience handlers
  const handleSaveExperience = (experience: Experience) => {
    const existingIndex = experiences.findIndex(e => e.id === experience.id)
    if (existingIndex >= 0) {
      const updatedExperiences = [...experiences]
      updatedExperiences[existingIndex] = experience
      setExperiences(updatedExperiences)
    } else {
      setExperiences([...experiences, experience])
    }
    // TODO: Sync with backend
  }

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id))
    // TODO: Sync with backend
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <AdminLogin darkMode={darkMode} onLogin={handleLogin} />
  }

  // Admin routes
  return (
    <AdminLayout darkMode={darkMode} onLogout={handleLogout}>
      <Routes>
        <Route
          path="/"
          element={
            <AdminDashboard
              darkMode={darkMode}
              blogs={blogs}
              projects={projects}
              skills={skills}
              socials={socials}
              experiences={experiences}
            />
          }
        />
        <Route
          path="/blogs"
          element={
            <BlogsManager
              darkMode={darkMode}
              blogs={blogs}
              onSave={handleSaveBlog}
              onDelete={handleDeleteBlog}
            />
          }
        />
        <Route
          path="/projects"
          element={
            <ProjectsManager
              darkMode={darkMode}
              projects={projects}
              onSave={handleSaveProject}
              onDelete={handleDeleteProject}
            />
          }
        />
        <Route
          path="/skills"
          element={
            <SkillsManager
              darkMode={darkMode}
              skills={skills}
              onSave={handleSaveSkill}
              onDelete={handleDeleteSkill}
            />
          }
        />
        <Route
          path="/socials"
          element={
            <SocialsManager
              darkMode={darkMode}
              socials={socials}
              onSave={handleSaveSocial}
              onDelete={handleDeleteSocial}
            />
          }
        />
        <Route
          path="/experience"
          element={
            <ExperienceManager
              darkMode={darkMode}
              experiences={experiences}
              onSave={handleSaveExperience}
              onDelete={handleDeleteExperience}
            />
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default Admin