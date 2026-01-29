import React, { useState } from "react"
import type { BlogPost } from "@/types/blog"
import BlogEditor from "./BlogEditor"

interface BlogsManagerProps {
  darkMode: boolean
  blogs: BlogPost[]
  onSave: (blog: BlogPost) => void
  onDelete: (id: string) => void
}

const BlogsManager: React.FC<BlogsManagerProps> = ({ darkMode, blogs, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingBlog(undefined)
    setIsEditing(true)
  }

  const handleSave = (blog: BlogPost) => {
    onSave(blog)
    setIsEditing(false)
    setEditingBlog(undefined)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingBlog(undefined)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      onDelete(id)
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isEditing) {
    return (
      <BlogEditor
        darkMode={darkMode}
        post={editingBlog}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Blog Posts</h1>
          <p className={`text-sm sm:text-base ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
            Manage your blog content
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 sm:px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-sm sm:text-base"
          style={{ backgroundColor: "#2B93E2" }}
        >
          + Create New Post
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blog posts..."
          className={`w-full px-4 py-3 rounded-lg border text-sm sm:text-base ${
            darkMode
              ? "bg-[#1A1A1A] border-[#333333] text-white"
              : "bg-white border-[#E5E5E5] text-black"
          } outline-none focus:border-[#2B93E2]`}
        />
      </div>

      {/* Blog Posts List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredBlogs.length === 0 ? (
          <div
            className={`text-center py-12 rounded-xl ${
              darkMode ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <p className={`text-base sm:text-lg ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
              {searchQuery ? "No blog posts found" : "No blog posts yet. Create your first post!"}
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className={`p-4 sm:p-6 rounded-xl transition-all ${
                darkMode
                  ? "bg-[#1A1A1A] hover:bg-[#1F1F1F]"
                  : "bg-white hover:bg-[#F9F9F9]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold">{blog.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded self-start ${
                        darkMode ? "bg-[#2A2A2A] text-[#CCCCCC]" : "bg-[#E5E5E5] text-[#666666]"
                      }`}
                    >
                      {blog.date}
                    </span>
                  </div>
                  <p
                    className={`mb-3 line-clamp-2 text-sm sm:text-base ${
                      darkMode ? "text-[#CCCCCC]" : "text-[#666666]"
                    }`}
                  >
                    {blog.excerpt}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className={darkMode ? "text-[#888888]" : "text-[#999999]"}>
                      Slug: {blog.slug}
                    </span>
                    <span className={darkMode ? "text-[#888888]" : "text-[#999999]"}>
                      {blog.blocks?.length || 0} blocks
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 sm:ml-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      darkMode
                        ? "bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#333333]"
                        : "bg-[#E5E5E5] text-[#666666] hover:bg-[#DDDDDD]"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-all text-sm"
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

export default BlogsManager