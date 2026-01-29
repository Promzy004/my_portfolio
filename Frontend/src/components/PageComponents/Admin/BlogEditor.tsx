import React, { useState } from "react"
import type { BlogPost, BlogBlock } from "@/types/blog"

interface BlogEditorProps {
  darkMode: boolean
  post?: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void
}

const BlogEditor: React.FC<BlogEditorProps> = ({ darkMode, post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [date, setDate] = useState(post?.date || new Date().toISOString().split('T')[0])
  const [slug, setSlug] = useState(post?.slug || "")
  const [blocks, setBlocks] = useState<BlogBlock[]>(post?.blocks || [])

  const addBlock = (type: BlogBlock["type"]) => {
    const newBlock: BlogBlock = {
      id: `b${Date.now()}`,
      type,
      data: getDefaultBlockData(type),
    }
    setBlocks([...blocks, newBlock])
  }

  const getDefaultBlockData = (type: BlogBlock["type"]) => {
    switch (type) {
      case "paragraph":
        return { text: "" }
      case "heading":
        return { level: 2 as 2 | 3, text: "" }
      case "list":
        return { items: [""] }
      case "code":
        return { code: "", language: "javascript" }
      case "callout":
        return { text: "" }
      default:
        return {}
    }
  }

  const updateBlock = (index: number, data: any) => {
    const updatedBlocks = [...blocks]
    updatedBlocks[index] = { ...updatedBlocks[index], data }
    setBlocks(updatedBlocks)
  }

  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index))
  }

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const updatedBlocks = [...blocks]
    const temp = updatedBlocks[index]
    updatedBlocks[index] = updatedBlocks[newIndex]
    updatedBlocks[newIndex] = temp
    setBlocks(updatedBlocks)
  }

  const handleSave = () => {
    if (!title || !excerpt || !slug) {
      alert("Please fill in all required fields")
      return
    }

    const blogPost: BlogPost = {
      id: post?.id || String(Date.now()),
      title,
      excerpt,
      date,
      slug,
      blocks,
    }

    onSave(blogPost)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {post ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 text-sm sm:text-base"
            style={{ backgroundColor: "#2B93E2" }}
          >
            Save Post
          </button>
        </div>
      </div>

      {/* Basic Info Form */}
      <div
        className={`p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 ${
          darkMode ? "bg-[#1A1A1A]" : "bg-white"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4">Post Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm sm:text-base ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
              Excerpt *
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border text-sm sm:text-base ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Brief description of the post"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className={`w-full px-4 py-2 rounded-lg border text-sm sm:text-base ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
                placeholder="url-friendly-slug"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-[#CCCCCC]" : "text-[#333333]"}`}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#2A2A2A] border-[#333333] text-white"
                    : "bg-white border-[#E5E5E5] text-black"
                } outline-none focus:border-[#2B93E2]`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div
        className={`p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 ${
          darkMode ? "bg-[#1A1A1A]" : "bg-white"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4">Content Blocks</h2>

        {/* Add Block Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => addBlock("paragraph")}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            + Paragraph
          </button>
          <button
            onClick={() => addBlock("heading")}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            + Heading
          </button>
          <button
            onClick={() => addBlock("list")}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            + List
          </button>
          <button
            onClick={() => addBlock("code")}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            + Code
          </button>
          <button
            onClick={() => addBlock("callout")}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              darkMode
                ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
            }`}
          >
            + Callout
          </button>
        </div>

        {/* Blocks List */}
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              No blocks yet. Add a block to start writing.
            </p>
          ) : (
            blocks.map((block, index) => (
              <BlockEditor
                key={block.id}
                block={block}
                index={index}
                darkMode={darkMode}
                onUpdate={(data) => updateBlock(index, data)}
                onDelete={() => deleteBlock(index)}
                onMoveUp={() => moveBlock(index, "up")}
                onMoveDown={() => moveBlock(index, "down")}
                canMoveUp={index > 0}
                canMoveDown={index < blocks.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Individual Block Editor Component
interface BlockEditorProps {
  block: BlogBlock
  index: number
  darkMode: boolean
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  darkMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const renderBlockEditor = () => {
    switch (block.type) {
      case "paragraph":
        return (
          <textarea
            value={block.data.text || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-[#2A2A2A] border-[#333333] text-white"
                : "bg-white border-[#E5E5E5] text-black"
            } outline-none focus:border-[#2B93E2]`}
            placeholder="Enter paragraph text..."
          />
        )

      case "heading":
        return (
          <div className="space-y-3">
            <select
              value={block.data.level || 2}
              onChange={(e) => onUpdate({ ...block.data, level: Number(e.target.value) as 2 | 3 })}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none`}
            >
              <option value={2}>Heading 2</option>
              <option value={3}>Heading 3</option>
            </select>
            <input
              type="text"
              value={block.data.text || ""}
              onChange={(e) => onUpdate({ ...block.data, text: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Enter heading text..."
            />
          </div>
        )

      case "list":
        return (
          <div className="space-y-2">
            {(block.data.items || [""]).map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(block.data.items || [])]
                    newItems[idx] = e.target.value
                    onUpdate({ items: newItems })
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-[#2A2A2A] border-[#333333] text-white"
                      : "bg-white border-[#E5E5E5] text-black"
                  } outline-none focus:border-[#2B93E2]`}
                  placeholder={`Item ${idx + 1}`}
                />
                <button
                  onClick={() => {
                    const newItems = (block.data.items || []).filter((_: any, i: number) => i !== idx)
                    onUpdate({ items: newItems.length ? newItems : [""] })
                  }}
                  className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => onUpdate({ items: [...(block.data.items || []), ""] })}
              className={`px-4 py-2 rounded-lg text-sm ${
                darkMode
                  ? "bg-[#2A2A2A] text-[#CCCCCC]"
                  : "bg-[#E5E5E5] text-[#666666]"
              }`}
            >
              + Add Item
            </button>
          </div>
        )

      case "code":
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={block.data.language || "javascript"}
              onChange={(e) => onUpdate({ ...block.data, language: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Language (e.g., javascript, python, go)"
            />
            <textarea
              value={block.data.code || ""}
              onChange={(e) => onUpdate({ ...block.data, code: e.target.value })}
              rows={6}
              className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white"
                  : "bg-white border-[#E5E5E5] text-black"
              } outline-none focus:border-[#2B93E2]`}
              placeholder="Enter code..."
            />
          </div>
        )

      case "callout":
        return (
          <textarea
            value={block.data.text || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-[#2A2A2A] border-[#333333] text-white"
                : "bg-white border-[#E5E5E5] text-black"
            } outline-none focus:border-[#2B93E2]`}
            placeholder="Enter callout text..."
          />
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border ${
        darkMode ? "border-[#333333] bg-[#0F0F0F]" : "border-[#E5E5E5] bg-[#FAFAFA]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "#2B93E2", color: "white" }}
        >
          {block.type.toUpperCase()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={`px-2 py-1 rounded text-sm ${
              canMoveUp
                ? darkMode
                  ? "hover:bg-[#2A2A2A] text-[#CCCCCC]"
                  : "hover:bg-[#E5E5E5] text-[#666666]"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={`px-2 py-1 rounded text-sm ${
              canMoveDown
                ? darkMode
                  ? "hover:bg-[#2A2A2A] text-[#CCCCCC]"
                  : "hover:bg-[#E5E5E5] text-[#666666]"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            ↓
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 rounded text-sm text-red-500 hover:bg-red-500/10"
          >
            🗑
          </button>
        </div>
      </div>
      {renderBlockEditor()}
    </div>
  )
}

export default BlogEditor