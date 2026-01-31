import React from "react"
import BlogCard from "@/components/PageComponents/Blog/BlogCard"
import { blogData } from "@/data/BlogData"
import Footer from "../components/PageComponents/Home/Footer"
import { generateBlogListSEO } from "@/utils/generateBlogSEO"
import SEO from "@/components/SEO/SEO"

interface BlogPageProps {
  darkMode: boolean
}

const Blog: React.FC<BlogPageProps> = ({ darkMode }) => {

  const seoData = generateBlogListSEO();

  return (
    <>
      <SEO {...seoData} />

      <div className="layout flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center items-center">
          <h1 className="font-black text-4xl sm:text-5xl">Blog</h1>

          <p
            className={`max-w-[700px] text-sm sm:text-base leading-7 ${
              darkMode ? "text-[#CCCCCC]" : "text-[#555555]"
            }`}
          >
            Writing about building real projects, learning the hard way, and
            turning experience into systems.
          </p>

          <div
            className="h-[2px] w-12 rounded-full"
            style={{ backgroundColor: "#2B93E2" }}
          />
        </div>

        {/* Blog list */}
        <div className="grid gap-6 sm:grid-cols-2">
          {blogData.map(post => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              slug={post.slug}
              darkMode={darkMode}
            />
          ))}
        </div>

        <Footer darkMode={darkMode} />
      </div>
    </>
  )
}

export default Blog
