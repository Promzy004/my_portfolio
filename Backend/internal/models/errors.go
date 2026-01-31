package models

import "errors"

// Common application errors
var (
	// Authentication errors
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUnauthorized       = errors.New("unauthorized access")
	ErrTokenExpired       = errors.New("token has expired")
	ErrInvalidToken       = errors.New("invalid token")

	// Validation errors
	ErrInvalidInput     = errors.New("invalid input data")
	ErrInvalidBlockData = errors.New("invalid block data structure")

	// Database errors
	ErrNotFound      = errors.New("resource not found")
	ErrDuplicateKey  = errors.New("duplicate key violation")
	ErrDatabase      = errors.New("database error")

	// Rate limiting errors
	ErrTooManyRequests = errors.New("too many requests, please try again later")

	// File upload errors
	ErrInvalidFileType = errors.New("invalid file type")
	ErrFileTooLarge    = errors.New("file size exceeds maximum allowed")
	ErrUploadFailed    = errors.New("file upload failed")

	// Setup errors
	ErrAdminExists = errors.New("admin user already exists")
)

// Response represents a standardized API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Meta    Pagination  `json:"meta"`
}

// Pagination contains pagination metadata
type Pagination struct {
	CurrentPage int `json:"current_page"`
	PerPage     int `json:"per_page"`
	Total       int `json:"total"`
	TotalPages  int `json:"total_pages"`
}