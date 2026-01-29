import React, { useState } from "react"
import type { Social } from "@/types/admin-types"

interface SocialsManagerProps {
  darkMode: boolean
  socials: Social[]
  onSave: (social: Social) => void
  onDelete: (id: string) => void
}

const SocialsManager: React.FC<SocialsManagerProps> = ({ darkMode, socials, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingSocial, setEditingSocial] = useState<Social | undefined>(undefined)

  const handleEdit = (social: Social) => {
    setEditingSocial(social)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingSocial(undefined)
    setIsEditing(true)
  }

  const handleSave = (social: Social) => {
    onSave(social)
    setIsEditing(false)
    setEditingSocial(undefined)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingSocial(undefined)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this social link?")) {
      onDelete(id)
    }
  }

  if (isEditing) {
    return (
      <SocialEditor
        darkMode={darkMode}
        social={editingSocial}
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
          <h1 className="text-3xl font-bold mb-2">Social Links</h1>
          <p className={`${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
            Manage your social media profiles
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2B93E2" }}
        >
          + Add Social Link
        </button>
      </div>

      {/* Socials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socials.length === 0 ? (
          <div
            className={`col-span-full text-center py-12 rounded-xl ${
              darkMode ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <p className={`text-lg ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              No social links yet. Add your first link!
            </p>
          </div>
        ) : (
          socials.map((social) => (
            <div
              key={social.id}
              className={`p-6 rounded-xl transition-all ${
                darkMode
                  ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]"
                  : "bg-white hover:bg-[#F9F9F9]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex-shrink-0"
                  dangerouslySetInnerHTML={{ __html: social.icon }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{social.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded inline-block mb-2 ${
                      darkMode ? "bg-[#2A2A2A] text-[#CCCCCC]" : "bg-[#E5E5E5] text-[#666666]"
                    }`}
                  >
                    {social.platform}
                  </span>
                  <p
                    className={`text-sm break-all ${
                      darkMode ? "text-[#888888]" : "text-[#999999]"
                    }`}
                  >
                    {social.url}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(social)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    darkMode
                      ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                      : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(social.id)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Social Editor Component
interface SocialEditorProps {
  darkMode: boolean
  social?: Social
  onSave: (social: Social) => void
  onCancel: () => void
}

const SocialEditor: React.FC<SocialEditorProps> = ({ darkMode, social, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Social>(
    social || {
      id: `social-${Date.now()}`,
      name: "",
      url: "",
      icon: "",
      platform: "other",
    }
  )

  const handleChange = (field: keyof Social, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.url || !formData.icon) {
      alert("Please fill in all required fields")
      return
    }
    onSave(formData)
  }

  // Platform-specific icon templates
  const iconTemplates = {
    github: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
</svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
</svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
</svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
  <polyline points="22,6 12,13 2,6"/>
</svg>`
  }

  const loadTemplate = (platform: Social["platform"]) => {
    const template = iconTemplates[platform as keyof typeof iconTemplates]
    if (template) {
      handleChange("icon", template)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {social ? "Edit Social Link" : "Add Social Link"}
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
            Save Social
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
              Platform *
            </label>
            <select
              value={formData.platform}
              onChange={(e) => {
                const platform = e.target.value as Social["platform"]
                handleChange("platform", platform)
                loadTemplate(platform)
              }}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
            >
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="tiktok">TikTok</option>
              <option value="email">Email</option>
              <option value="other">Other</option>
            </select>
            <p className={`text-xs mt-1 ${darkMode ? "text-[#888888]" : "text-[#999999]"}`}>
              Selecting a platform will auto-fill the icon template
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Display Name *
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
              placeholder="e.g., GitHub, LinkedIn"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="https://github.com/username"
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
              placeholder="<svg>...</svg>"
            />
            <p className={`text-xs mt-2 ${darkMode ? "text-[#888888]" : "text-[#999999]"}`}>
              Paste the complete SVG code. Templates are auto-loaded when you select a platform.
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
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: formData.icon }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialsManager