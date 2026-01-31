import React from "react"
import { useParams } from "react-router-dom"
// import SEO from "@/components/SEO/SEO"
import Footer from "@/components/PageComponents/Home/Footer"
import BlogDetail from "@/components/PageComponents/Blog/BlogDetail"
import { blogData } from "@/data/BlogData"
import SEO from "@/components/SEO/SEO"
import { generateBlogSEO } from "@/utils/generateBlogSEO"

interface BlogDetailsProps {
  darkMode: boolean
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ darkMode }) => {
  const { slug } = useParams<{ slug: string }>()
  const post = blogData.find(b => b.slug === slug)

  if (!post) {
    return (
      <p className={`text-center mt-20 ${darkMode ? "text-white" : "text-black"}`}>
        Post not found
      </p>
    )
  }

  const seoData = generateBlogSEO(post);

  return (
    <>
      <SEO {...seoData} />

      <div className="layout flex flex-col gap-12">
        <BlogDetail post={post} darkMode={darkMode} />
        <Footer darkMode={darkMode} />
      </div>
    </>
  )
}

export default BlogDetails
