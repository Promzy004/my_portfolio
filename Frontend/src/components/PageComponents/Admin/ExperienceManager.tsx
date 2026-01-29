import React, { useState } from "react"
import type { Experience } from "@/types/admin-types"

interface ExperienceManagerProps {
  darkMode: boolean
  experiences: Experience[]
  onSave: (experience: Experience) => void
  onDelete: (id: string) => void
}

const ExperienceManager: React.FC<ExperienceManagerProps> = ({ darkMode, experiences, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingExperience(undefined)
    setIsEditing(true)
  }

  const handleSave = (experience: Experience) => {
    onSave(experience)
    setIsEditing(false)
    setEditingExperience(undefined)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingExperience(undefined)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      onDelete(id)
    }
  }

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort by date (most recent first)
  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    const dateA = a.endDate === 'Present' ? new Date() : new Date(a.endDate)
    const dateB = b.endDate === 'Present' ? new Date() : new Date(b.endDate)
    return dateB.getTime() - dateA.getTime()
  })

  if (isEditing) {
    return (
      <ExperienceEditor
        darkMode={darkMode}
        experience={editingExperience}
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
          <h1 className="text-3xl font-bold mb-2">Work Experience</h1>
          <p className={`${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
            Manage your professional experience
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2B93E2" }}
        >
          + Add Experience
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search experiences..."
          className={`w-full px-4 py-3 rounded-lg border ${
            darkMode
              ? "bg-[#1A1A1A] border-[#333333] text-white"
              : "bg-white border-[#E5E5E5] text-black"
          } outline-none focus:border-[#2B93E2]`}
        />
      </div>

      {/* Experience Timeline */}
      <div className="space-y-6">
        {sortedExperiences.length === 0 ? (
          <div
            className={`text-center py-12 rounded-xl ${
              darkMode ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <p className={`text-lg ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              {searchQuery ? "No experiences found" : "No experiences yet. Add your first experience!"}
            </p>
          </div>
        ) : (
          sortedExperiences.map((exp) => (
            <div
              key={exp.id}
              className={`p-6 rounded-xl transition-all ${
                darkMode
                  ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]"
                  : "bg-white hover:bg-[#F9F9F9]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                  <p className="text-lg mb-2" style={{ color: "#2B93E2" }}>
                    {exp.company}
                  </p>
                  <div className={`flex items-center gap-3 text-sm ${darkMode ? "text-[#888888]" : "text-[#999999]"}`}>
                    <span>{exp.startDate} - {exp.endDate}</span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                        : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className={`mb-4 leading-relaxed ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-full ${
                      darkMode ? "bg-[#2A2A2A] text-[#CCCCCC]" : "bg-[#E5E5E5] text-[#666666]"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Experience Editor Component
interface ExperienceEditorProps {
  darkMode: boolean
  experience?: Experience
  onSave: (experience: Experience) => void
  onCancel: () => void
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ darkMode, experience, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Experience>(
    experience || {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
      location: "",
    }
  )
  const [techInput, setTechInput] = useState("")
  const [isCurrentRole, setIsCurrentRole] = useState(formData.endDate === 'Present')

  const handleChange = (field: keyof Experience, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      handleChange("technologies", [...formData.technologies, techInput.trim()])
      setTechInput("")
    }
  }

  const removeTech = (tech: string) => {
    handleChange("technologies", formData.technologies.filter(t => t !== tech))
  }

  const handleCurrentRoleChange = (checked: boolean) => {
    setIsCurrentRole(checked)
    if (checked) {
      handleChange("endDate", "Present")
    } else {
      handleChange("endDate", "")
    }
  }

  const handleSubmit = () => {
    if (!formData.company || !formData.position || !formData.startDate || !formData.description) {
      alert("Please fill in all required fields")
      return
    }
    if (!isCurrentRole && !formData.endDate) {
      alert("Please provide an end date or mark this as your current role")
      return
    }
    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {experience ? "Edit Experience" : "Add New Experience"}
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
            Save Experience
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
                placeholder="Company name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
                placeholder="Job title"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Location
            </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="City, Country"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Start Date *
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                End Date *
              </label>
              <input
                type="month"
                value={isCurrentRole ? "" : formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                disabled={isCurrentRole}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2] ${isCurrentRole ? "opacity-50" : ""}`}
              />
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={isCurrentRole}
                  onChange={(e) => handleCurrentRoleChange(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: "#2B93E2" }}
                />
                <span className={`text-sm ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
                  Currently working here
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Technologies / Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
                placeholder="Add a technology (press Enter)"
              />
              <button
                onClick={addTech}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "#2B93E2" }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    darkMode ? "bg-[#2A2A2A] text-[#CCCCCC]" : "bg-[#E5E5E5] text-[#666666]"
                  }`}
                >
                  {tech}
                  <button
                    onClick={() => removeTech(tech)}
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

export default ExperienceManager