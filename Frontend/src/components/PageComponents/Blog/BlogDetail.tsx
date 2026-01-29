import React from "react"
import BlockRenderer from "./BlockRenderer"
import type { BlogPost } from "@/types/blog"

interface BlogDetailProps {
  post: BlogPost
  darkMode: boolean
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, darkMode }) => {
  return (
    <article className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2 text-center items-center">
        <h1 className="text-4xl font-black">{post.title}</h1>
        <p className={`text-sm ${darkMode ? "text-[#CCCCCC]" : "text-[#555555]"}`}>
          {post.date}
        </p>
        <div className="h-[2px] w-12 rounded-full" style={{ backgroundColor: "#2B93E2" }} />
      </header>

      {/* Blocks */}
      <section className="flex flex-col gap-6">
        {post.blocks?.map(block => (
          <BlockRenderer key={block.id} block={block} darkMode={darkMode} />
        ))}
      </section>
    </article>
  )
}

export default BlogDetail