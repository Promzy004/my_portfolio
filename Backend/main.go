package main

import (
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/Promzy004/my_portfolio/config"
	"github.com/Promzy004/my_portfolio/internal/handlers"
	"github.com/Promzy004/my_portfolio/internal/middlewares"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
	"github.com/Promzy004/my_portfolio/routes"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize validator
	utils.InitValidator()

	// Setup database connection
	db, err := config.SetupDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	log.Println("Database connection established")

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	blogRepo := repositories.NewBlogRepository(db)
	projectRepo := repositories.NewProjectRepository(db)
	skillRepo := repositories.NewSkillRepository(db)
	socialRepo := repositories.NewSocialRepository(db)
	experienceRepo := repositories.NewExperienceRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, &cfg.JWT, &cfg.RateLimit)
	blogService := services.NewBlogService(blogRepo)
	projectService := services.NewProjectService(projectRepo)
	skillService := services.NewSkillService(skillRepo)
	socialService := services.NewSocialService(socialRepo)
	experienceService := services.NewExperienceService(experienceRepo)

	cloudinaryService, err := services.NewCloudinaryService(&cfg.Cloudinary, &cfg.FileUpload)
	if err != nil {
		log.Fatalf("Failed to initialize Cloudinary service: %v", err)
	}

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	blogHandler := handlers.NewBlogHandler(blogService)
	projectHandler := handlers.NewProjectHandler(projectService)
	skillHandler := handlers.NewSkillHandler(skillService)
	socialHandler := handlers.NewSocialHandler(socialService)
	experienceHandler := handlers.NewExperienceHandler(experienceService)
	uploadHandler := handlers.NewUploadHandler(cloudinaryService)

	// Initialize middlewares
	authMiddleware := middlewares.NewAuthMiddleware(authService)

	// Setup router
	r := chi.NewRouter()

	// Apply global middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// CORS configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CORS.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Setup API routes
	routes.SetupRoutes(r, routes.RouteHandlers{
		Auth:       authHandler,
		Blog:       blogHandler,
		Project:    projectHandler,
		Skill:      skillHandler,
		Social:     socialHandler,
		Experience: experienceHandler,
		Upload:     uploadHandler,
	}, authMiddleware)

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		utils.SendSuccess(w, http.StatusOK, "Server is healthy", map[string]string{
			"status": "up",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// Start cleanup routine for expired tokens
	go func() {
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()

		for range ticker.C {
			if err := authService.CleanupExpiredTokens(); err != nil {
				log.Printf("Failed to cleanup expired tokens: %v", err)
			}
		}
	}()

	// Start server
	serverAddr := ":" + cfg.Server.Port
	log.Printf("Server starting on %s in %s mode", serverAddr, cfg.Server.Environment)

	if err := http.ListenAndServe(serverAddr, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
