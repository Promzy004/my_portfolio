// src/data/BlogData.ts
import type { BlogPost } from "@/types/blog"

export const blogData: BlogPost[] = [
  {
    id: "1",
    title: "Structuring Golang Projects Like Laravel",
    excerpt: "How I carried Laravel conventions into a Go backend without fighting the language.",
    date: "Jan 28, 2026",
    slug: "golang-project-structure-laravel",
    blocks: [
      { id: "b1", type: "paragraph", data: { text: "When I started building Go applications, I realized that structuring projects like Laravel made development much smoother." } },
      { id: "b2", type: "heading", data: { level: 2, text: "Why Laravel Patterns Help" } },
      { id: "b3", type: "list", data: { items: ["Controllers handle HTTP requests", "Services contain business logic", "Repositories manage data access"] } },
      { id: "b4", type: "code", data: { code: `package main\n\nfunc main() {\n\tprintln("Hello Go!")\n}`, language: "go" } },
      { id: "b5", type: "callout", data: { text: "Tip: Keep your services thin and focused on business logic." } }
    ]
  },
  {
    id: "2",
    title: "SEO Tips for Developers",
    excerpt: "How developers can optimize content without relying on marketing teams.",
    date: "Feb 2, 2026",
    slug: "seo-tips-for-developers",
    blocks: [
      { id: "b6", type: "paragraph", data: { text: "SEO is not just for marketers. Developers can structure content and meta tags for better ranking." } },
      { id: "b7", type: "heading", data: { level: 2, text: "Meta Tags and Keywords" } },
      { id: "b8", type: "list", data: { items: ["Title Tag", "Meta Description", "Focus Keywords", "Alt Text for Images"] } },
      { id: "b9", type: "callout", data: { text: "Always keep your meta description under 160 characters for optimal display in search results." } }
    ]
  },
  {
    id: "3",
    title: "Mastering React with TypeScript",
    excerpt: "A guide to building type-safe React apps using TypeScript for better developer experience.",
    date: "Feb 10, 2026",
    slug: "mastering-react-typescript",
    blocks: [
      { id: "b10", type: "paragraph", data: { text: "TypeScript improves React development by catching errors early and making your code more predictable." } },
      { id: "b11", type: "heading", data: { level: 2, text: "Hooks and Typing" } },
      { id: "b12", type: "list", data: { items: ["useState<T>()", "useRef<HTMLDivElement>()", "Typed Contexts"] } },
      { id: "b13", type: "code", data: { code: `const [count, setCount] = useState<number>(0)`, language: "ts" } },
      { id: "b14", type: "callout", data: { text: "Tip: Always type your state and props for predictable behavior." } }
    ]
  },

  {
    id: "4",
    title: "Golang Project Structure for Laravel Developers (What I Kept, What I Dropped)",
    excerpt: "Coming from Laravel and confused about Golang project structure? Here’s how I structured my Go backend using familiar Laravel patterns—without fighting Go.",
    date: "Jan 28, 2026",
    slug: "golang-laravel-structure-guide",
    blocks: [
      {
        id: "b101",
        type: "paragraph",
        data: {
          text: "If you’re coming from Laravel, one of the first frustrating things about Golang is the lack of a clear, opinionated project structure. Laravel gives you everything: Controllers, Models, Migrations, Seeders, A clear MVC flow. Golang gives you… freedom. Too much freedom. This post explains how I arrived at a Golang project structure that feels familiar to Laravel developers, what parts of Laravel I intentionally copied, and what I had to unlearn to stay idiomatic in Go."
        }
      },
      {
        id: "b102",
        type: "heading",
        data: { level: 2, text: "Why Golang Project Structure Feels Confusing at First" }
      },
      {
        id: "b103",
        type: "paragraph",
        data: {
          text: "The Go community often says: “There’s no standard project structure.” That statement is technically true—but deeply unhelpful when you’re used to Laravel’s conventions. When I started structuring my Go backend, I kept asking: Where do controllers go? Where does business logic live? Do I need a service layer? How do repositories fit in Go? The answer wasn’t “don’t structure your project.” The answer was structure it intentionally."
        }
      },
      {
        id: "b104",
        type: "heading",
        data: { level: 2, text: "What I Brought From Laravel Into Go" }
      },
      {
        id: "b105",
        type: "list",
        data: {
          items: [
            "Controllers → Handlers: Laravel controllers map almost perfectly to Go HTTP handlers. Handlers accept requests, validate input, call the business layer, return responses. They should stay thin—just like good Laravel controllers.",
            "Routes Layer Still Matters: Even though Go routers are lightweight, separating routing logic from handlers keeps things readable. This mirrors Laravel’s routes/web.php and routes/api.php separation.",
            "Repositories (But Only When They Earn Their Place): I initially resisted repositories because the Go community often warns against over-abstraction. But for database isolation, easier testing, and cleaner handlers, a repository layer made sense, as long as it stayed simple."
          ]
        }
      },
      {
        id: "b106",
        type: "heading",
        data: { level: 2, text: "What I Stopped Copying From Laravel" }
      },
      {
        id: "b107",
        type: "list",
        data: {
          items: [
            "No Forced MVC: Trying to recreate Laravel’s MVC folder-for-folder made the project worse. Go doesn’t need fat service layers, deep inheritance trees, or magic dependency injection. Explicit dependencies beat hidden magic every time.",
            "No Premature Abstractions: In Laravel, abstractions are cheap. In Go, unnecessary abstractions hurt readability. If a layer doesn’t reduce duplication, improve testability, or clarify intent, it doesn’t belong."
          ]
        }
      },
      {
        id: "b108",
        type: "heading",
        data: { level: 2, text: "The Golang Project Structure I Settled On" }
      },
      {
        id: "b109",
        type: "code",
        data: {
          code: `/cmd
    /api
      main.go
  
  /internal
    /routes
    /handlers
    /repositories
    /services
    /models
    /database
  
  /config`,
          language: "text"
        }
      },
      {
        id: "b110",
        type: "paragraph",
        data: {
          text: "Why this works: cmd defines entry points, internal protects core logic, each layer has a clear responsibility, familiar enough for Laravel devs, idiomatic enough for Go. This Golang project structure scales without becoming rigid."
        }
      },
      {
        id: "b111",
        type: "heading",
        data: { level: 2, text: "How This Structure Improves Maintainability" }
      },
      {
        id: "b112",
        type: "paragraph",
        data: {
          text: "With this setup: handlers stay thin, business logic is testable, database access is isolated, refactoring doesn’t cause chaos. It also makes onboarding easier—especially for developers coming from Laravel."
        }
      },
      {
        id: "b113",
        type: "heading",
        data: { level: 2, text: "Final Thoughts" }
      },
      {
        id: "b114",
        type: "paragraph",
        data: {
          text: "If you’re moving from Laravel to Golang, your goal shouldn’t be to rewrite Laravel in Go. The goal is to: keep what made you productive, drop what Go doesn’t need, and build a structure that serves your application. There’s no single “best” Golang project structure, but there is a structure that makes sense for you. And this one worked for me."
        }
      }
    ]
  }
  
]
