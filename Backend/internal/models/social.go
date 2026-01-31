package models

import "time"

// Social represents a social media link
type Social struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name" validate:"required,min=2,max=255"`
	URL       string    `json:"url" db:"url" validate:"required,url"`
	Icon      string    `json:"icon" db:"icon" validate:"required"`
	Platform  string    `json:"platform" db:"platform" validate:"required,oneof=github linkedin twitter tiktok email other"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// SocialCreateRequest represents the request to create a new social link
type SocialCreateRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=255"`
	URL      string `json:"url" validate:"required,url"`
	Icon     string `json:"icon" validate:"required"`
	Platform string `json:"platform" validate:"required,oneof=github linkedin twitter tiktok email other"`
}

// SocialUpdateRequest represents the request to update an existing social link
type SocialUpdateRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=255"`
	URL      string `json:"url" validate:"required,url"`
	Icon     string `json:"icon" validate:"required"`
	Platform string `json:"platform" validate:"required,oneof=github linkedin twitter tiktok email other"`
}