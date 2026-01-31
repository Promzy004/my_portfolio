package routes

import (
	"github.com/Promzy004/my_portfolio/internal/handlers"
	"github.com/Promzy004/my_portfolio/internal/middlewares"
	"github.com/go-chi/chi/v5"
)

// RouteHandlers contains all HTTP handlers
type RouteHandlers struct {
	Auth       *handlers.AuthHandler
	Blog       *handlers.BlogHandler
	Project    *handlers.ProjectHandler
	Skill      *handlers.SkillHandler
	Social     *handlers.SocialHandler
	Experience *handlers.ExperienceHandler
	Upload     *handlers.UploadHandler
}

// SetupRoutes configures all API routes
func SetupRoutes(r chi.Router, h RouteHandlers, auth *middlewares.AuthMiddleware) {
	r.Route("/api", func(r chi.Router) {
		// Authentication routes (public)
		r.Route("/auth", func(r chi.Router) {
			r.Post("/setup", h.Auth.Setup)
			r.Post("/login", h.Auth.Login)
			r.Post("/refresh", h.Auth.RefreshToken)
			r.Post("/logout", h.Auth.Logout)
		})

		// Blog routes
		r.Route("/blogs", func(r chi.Router) {
			// Public routes
			r.Get("/", h.Blog.GetAll)
			r.Get("/{id}", h.Blog.GetByID)

			// Protected routes
			r.Group(func(r chi.Router) {
				r.Use(auth.RequireAuth)
				r.Post("/", h.Blog.Create)
				r.Put("/{id}", h.Blog.Update)
				r.Delete("/{id}", h.Blog.Delete)
			})
		})

		// Project routes
		r.Route("/projects", func(r chi.Router) {
			// Public routes
			r.Get("/", h.Project.GetAll)
			r.Get("/{id}", h.Project.GetByID)

			// Protected routes
			r.Group(func(r chi.Router) {
				r.Use(auth.RequireAuth)
				r.Post("/", h.Project.Create)
				r.Put("/{id}", h.Project.Update)
				r.Delete("/{id}", h.Project.Delete)
			})
		})

		// Skill routes
		r.Route("/skills", func(r chi.Router) {
			// Public routes
			r.Get("/", h.Skill.GetAll)
			r.Get("/{id}", h.Skill.GetByID)

			// Protected routes
			r.Group(func(r chi.Router) {
				r.Use(auth.RequireAuth)
				r.Post("/", h.Skill.Create)
				r.Put("/{id}", h.Skill.Update)
				r.Delete("/{id}", h.Skill.Delete)
			})
		})

		// Social routes
		r.Route("/socials", func(r chi.Router) {
			// Public routes
			r.Get("/", h.Social.GetAll)
			r.Get("/{id}", h.Social.GetByID)

			// Protected routes
			r.Group(func(r chi.Router) {
				r.Use(auth.RequireAuth)
				r.Post("/", h.Social.Create)
				r.Put("/{id}", h.Social.Update)
				r.Delete("/{id}", h.Social.Delete)
			})
		})

		// Experience routes
		r.Route("/experiences", func(r chi.Router) {
			// Public routes
			r.Get("/", h.Experience.GetAll)
			r.Get("/{id}", h.Experience.GetByID)

			// Protected routes
			r.Group(func(r chi.Router) {
				r.Use(auth.RequireAuth)
				r.Post("/", h.Experience.Create)
				r.Put("/{id}", h.Experience.Update)
				r.Delete("/{id}", h.Experience.Delete)
			})
		})

		// Upload routes (protected)
		r.Route("/upload", func(r chi.Router) {
			r.Use(auth.RequireAuth)
			r.Post("/image", h.Upload.UploadImage)
		})
	})
}
