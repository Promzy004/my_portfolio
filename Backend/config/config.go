package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration loaded from environment variables
type Config struct {
	Server      ServerConfig
	Database    DatabaseConfig
	JWT         JWTConfig
	CORS        CORSConfig
	Cloudinary  CloudinaryConfig
	RateLimit   RateLimitConfig
	FileUpload  FileUploadConfig
}

// ServerConfig contains server-specific configuration
type ServerConfig struct {
	Port        string
	Environment string
}

// DatabaseConfig contains database connection configuration
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

// JWTConfig contains JWT token configuration
type JWTConfig struct {
	Secret        string
	AccessExpiry  time.Duration
	RefreshExpiry time.Duration
}

// CORSConfig contains CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
}

// CloudinaryConfig contains Cloudinary API configuration
type CloudinaryConfig struct {
	CloudName    string
	APIKey       string
	APISecret    string
	UploadFolder string
}

// RateLimitConfig contains rate limiting configuration
type RateLimitConfig struct {
	LoginLimit  int
	LoginWindow time.Duration
}

// FileUploadConfig contains file upload constraints
type FileUploadConfig struct {
	MaxSize           int64
	AllowedImageTypes []string
}

// Load reads environment variables and returns a Config struct
func Load() (*Config, error) {
	// Load .env file if it exists (ignore error in production)
	_ = godotenv.Load()

	// Parse JWT expiry durations
	accessExpiry, err := time.ParseDuration(getEnv("JWT_ACCESS_EXPIRY", "30m"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_ACCESS_EXPIRY: %w", err)
	}

	refreshExpiry, err := time.ParseDuration(getEnv("JWT_REFRESH_EXPIRY", "720h"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_REFRESH_EXPIRY: %w", err)
	}

	// Parse rate limit window
	loginWindow, err := time.ParseDuration(getEnv("LOGIN_RATE_WINDOW", "15m"))
	if err != nil {
		return nil, fmt.Errorf("invalid LOGIN_RATE_WINDOW: %w", err)
	}

	// Parse login rate limit
	loginLimit, err := strconv.Atoi(getEnv("LOGIN_RATE_LIMIT", "5"))
	if err != nil {
		return nil, fmt.Errorf("invalid LOGIN_RATE_LIMIT: %w", err)
	}

	// Parse max upload size
	maxUploadSize, err := strconv.ParseInt(getEnv("MAX_UPLOAD_SIZE", "2097152"), 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid MAX_UPLOAD_SIZE: %w", err)
	}

	config := &Config{
		Server: ServerConfig{
			Port:        getEnv("PORT", "8080"),
			Environment: getEnv("ENVIRONMENT", "development"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "3306"),
			User:     getEnv("DB_USER", "root"),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", "portfolio_db"),
		},
		JWT: JWTConfig{
			Secret:        getEnv("JWT_SECRET", "change_this_secret_key"),
			AccessExpiry:  accessExpiry,
			RefreshExpiry: refreshExpiry,
		},
		CORS: CORSConfig{
			AllowedOrigins: parseCSV(getEnv("ALLOWED_ORIGINS", "http://localhost:5173")),
		},
		Cloudinary: CloudinaryConfig{
			CloudName:    getEnv("CLOUDINARY_CLOUD_NAME", ""),
			APIKey:       getEnv("CLOUDINARY_API_KEY", ""),
			APISecret:    getEnv("CLOUDINARY_API_SECRET", ""),
			UploadFolder: getEnv("CLOUDINARY_UPLOAD_FOLDER", "portfolio"),
		},
		RateLimit: RateLimitConfig{
			LoginLimit:  loginLimit,
			LoginWindow: loginWindow,
		},
		FileUpload: FileUploadConfig{
			MaxSize:           maxUploadSize,
			AllowedImageTypes: parseCSV(getEnv("ALLOWED_IMAGE_TYPES", "jpg,jpeg,png,webp,svg")),
		},
	}

	return config, nil
}

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// parseCSV splits a comma-separated string into a slice
func parseCSV(value string) []string {
	if value == "" {
		return []string{}
	}
	
	var result []string
	for i := 0; i < len(value); {
		// Skip spaces
		for i < len(value) && value[i] == ' ' {
			i++
		}
		
		start := i
		// Find next comma
		for i < len(value) && value[i] != ',' {
			i++
		}
		
		if i > start {
			result = append(result, value[start:i])
		}
		
		// Skip comma
		if i < len(value) && value[i] == ',' {
			i++
		}
	}
	
	return result
}