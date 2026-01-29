import React, { useState } from "react"
import type { Project } from "@/types/admin-types"

interface ProjectsManagerProps {
  darkMode: boolean
  projects: Project[]
  onSave: (project: Project) => void
  onDelete: (id: number) => void
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ darkMode, projects, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingProject(undefined)
    setIsEditing(true)
  }

  const handleSave = (project: Project) => {
    onSave(project)
    setIsEditing(false)
    setEditingProject(undefined)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingProject(undefined)
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      onDelete(id)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isEditing) {
    return (
      <ProjectEditor
        darkMode={darkMode}
        project={editingProject}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className={`${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2B93E2" }}
        >
          + Add New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className={`w-full px-4 py-3 rounded-lg border ${
            darkMode
              ? "bg-[#1A1A1A] border-[#333333] text-white"
              : "bg-white border-[#E5E5E5] text-black"
          } outline-none focus:border-[#2B93E2]`}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div
            className={`col-span-full text-center py-12 rounded-xl ${
              darkMode ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <p className={`text-lg ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              {searchQuery ? "No projects found" : "No projects yet. Add your first project!"}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-6 rounded-xl transition-all ${
                darkMode
                  ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]"
                  : "bg-white hover:bg-[#F9F9F9]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold flex-1">{project.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ml-2 ${
                    darkMode ? "bg-[#2A2A2A] text-[#CCCCCC]" : "bg-[#E5E5E5] text-[#666666]"
                  }`}
                >
                  {project.category}
                </span>
              </div>

              <p
                className={`mb-3 text-sm line-clamp-3 ${
                  darkMode ? "text-[#CCCCCC]" : "text-[#666666]"
                }`}
              >
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#2B93E2", color: "white" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs ${darkMode ? "text-[#888888]" : "text-[#999999]"}`}>
                  {project.date}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                        : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Project Editor Component
interface ProjectEditorProps {
  darkMode: boolean
  project?: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ darkMode, project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Project>(
    project || {
      id: Date.now(),
      name: "",
      date: new Date().toISOString().split('T')[0],
      link: "",
      tags: [],
      desc: "",
      image: "",
      category: "web",
    }
  )
  const [tagInput, setTagInput] = useState("")

  const handleChange = (field: keyof Project, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange("tags", [...formData.tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    handleChange("tags", formData.tags.filter(t => t !== tag))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.desc) {
      alert("Please fill in all required fields")
      return
    }
    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {project ? "Edit Project" : "Add New Project"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#2B93E2" }}
          >
            Save Project
          </button>
        </div>
      </div>

      {/* Form */}
      <div
        className={`p-6 rounded-xl ${
          darkMode ? "bg-[#1A1A1A]" : "bg-white"
        }`}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Description *
            </label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleChange("desc", e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Project description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Project Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => handleChange("link", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Technologies / Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
                placeholder="Add a tag (press Enter)"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "#2B93E2" }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: "#2B93E2", color: "white" }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsManager