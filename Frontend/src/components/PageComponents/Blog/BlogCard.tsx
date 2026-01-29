import React from "react"
import { Link } from "react-router-dom"

interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
  darkMode: boolean
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  date,
  slug,
  darkMode
}) => {
  return (
    <Link to={`/blog/${slug}`}>
      <div
        className={`rounded-xl p-6 transition-all duration-300 cursor-pointer h-full flex flex-col ${
          darkMode ? "bg-[#302F2F]" : "bg-[#EAEAEA]"
        } hover:scale-[1.01]`}
      >
        <p className="text-xs text-[#888888] mb-2">{date}</p>

        <h2 className="text-xl font-bold mb-3 line-clamp-2">{title}</h2>

        <p
          className={`text-sm leading-6 mb-4 flex-grow line-clamp-3 ${
            darkMode ? "text-[#CCCCCC]" : "text-[#555555]"
          }`}
        >
          {excerpt}
        </p>

        <span
          className="inline-block text-sm font-semibold mt-auto"
          style={{ color: "#2B93E2" }}
        >
          Read more →
        </span>
      </div>
    </Link>
  )
}

export default BlogCard