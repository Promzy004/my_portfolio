import React, { useState } from "react"
import type { Skill } from "@/types/admin-types"

interface SkillsManagerProps {
  darkMode: boolean
  skills: Skill[]
  onSave: (skill: Skill) => void
  onDelete: (id: string) => void
}

const SkillsManager: React.FC<SkillsManagerProps> = ({ darkMode, skills, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingSkill(undefined)
    setIsEditing(true)
  }

  const handleSave = (skill: Skill) => {
    onSave(skill)
    setIsEditing(false)
    setEditingSkill(undefined)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingSkill(undefined)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      onDelete(id)
    }
  }

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isEditing) {
    return (
      <SkillEditor
        darkMode={darkMode}
        skill={editingSkill}
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
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className={`${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
            Manage your technical skills
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2B93E2" }}
        >
          + Add New Skill
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className={`w-full px-4 py-3 rounded-lg border ${
            darkMode
              ? "bg-[#1A1A1A] border-[#333333] text-white"
              : "bg-white border-[#E5E5E5] text-black"
          } outline-none focus:border-[#2B93E2]`}
        />
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSkills.length === 0 ? (
          <div
            className={`col-span-full text-center py-12 rounded-xl ${
              darkMode ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <p className={`text-lg ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              {searchQuery ? "No skills found" : "No skills yet. Add your first skill!"}
            </p>
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className={`p-4 rounded-xl transition-all relative group ${
                darkMode
                  ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]"
                  : "bg-white hover:bg-[#F9F9F9]"
              }`}
            >
              {/* Actions (shown on hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => handleEdit(skill)}
                  className={`p-1 rounded text-xs ${
                    darkMode
                      ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                      : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
                  }`}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1 rounded text-xs text-red-500 hover:bg-red-500/10"
                >
                  🗑
                </button>
              </div>

              {/* Skill Icon & Name */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 mb-3"
                  dangerouslySetInnerHTML={{ __html: skill.icon }}
                />
                <h3 className="font-semibold text-sm">{skill.name}</h3>
                {skill.category && (
                  <span
                    className={`text-xs mt-2 px-2 py-1 rounded ${
                      darkMode ? "bg-[#2A2A2A] text-[#CCCCCC]" : "bg-[#E5E5E5] text-[#666666]"
                    }`}
                  >
                    {skill.category}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Skill Editor Component
interface SkillEditorProps {
  darkMode: boolean
  skill?: Skill
  onSave: (skill: Skill) => void
  onCancel: () => void
}

const SkillEditor: React.FC<SkillEditorProps> = ({ darkMode, skill, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Skill>(
    skill || {
      id: `skill-${Date.now()}`,
      name: "",
      icon: "",
      category: "",
    }
  )

  const handleChange = (field: keyof Skill, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.icon) {
      alert("Please fill in all required fields")
      return
    }
    onSave(formData)
  }

  // Example SVG template
  const exampleSVG = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M9,13.7q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q11.1,10.9,9,13.7ZM2,22.1q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q4.1,19.3,2,22.1Z" fill="#44a8b3"/>
</svg>`

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {skill ? "Edit Skill" : "Add New Skill"}
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
            Save Skill
          </button>
        </div>
      </div>

      {/* Form */}
      <div
        className={`p-6 rounded-xl ${
          darkMode ? "bg-[#1A1A1A]" : "bg-white"
        }`}
      >
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Skill Name *
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
              placeholder="e.g., TailwindCSS"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Category (Optional)
            </label>
            <input
              type="text"
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="e.g., Frontend, Backend, Tools"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              SVG Icon Code *
            </label>
            <textarea
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              rows={8}
              className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder={exampleSVG}
            />
            <p className={`text-xs mt-2 ${darkMode ? "text-[#888888]" : "text-[#999999]"}`}>
              Paste the complete SVG code including the &lt;svg&gt; tags
            </p>
          </div>

          {/* Preview */}
          {formData.icon && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Preview
              </label>
              <div
                className={`p-6 rounded-lg border flex items-center justify-center ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333]"
                    : "bg-[#F5F5F5] border-[#E5E5E5]"
                }`}
              >
                <div className="w-20 h-20" dangerouslySetInnerHTML={{ __html: formData.icon }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillsManager