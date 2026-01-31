package models

import (
	"encoding/json"
	"time"
)

// Experience represents a work experience entry
type Experience struct {
	ID           string          `json:"id" db:"id"`
	Company      string          `json:"company" db:"company" validate:"required,min=2,max=500"`
	Position     string          `json:"position" db:"position" validate:"required,min=2,max=500"`
	StartDate    string          `json:"start_date" db:"start_date" validate:"required"`
	EndDate      string          `json:"end_date" db:"end_date" validate:"required"`
	Description  string          `json:"description" db:"description" validate:"required,min=10,max=5000"`
	Technologies json.RawMessage `json:"technologies" db:"technologies" validate:"required"`
	Location     string          `json:"location" db:"location" validate:"omitempty,max=255"`
	CreatedAt    time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at" db:"updated_at"`
}

// ExperienceCreateRequest represents the request to create a new experience
type ExperienceCreateRequest struct {
	Company      string   `json:"company" validate:"required,min=2,max=500"`
	Position     string   `json:"position" validate:"required,min=2,max=500"`
	StartDate    string   `json:"start_date" validate:"required"`
	EndDate      string   `json:"end_date" validate:"required"`
	Description  string   `json:"description" validate:"required,min=10,max=5000"`
	Technologies []string `json:"technologies" validate:"required,min=1"`
	Location     string   `json:"location" validate:"omitempty,max=255"`
}

// ExperienceUpdateRequest represents the request to update an existing experience
type ExperienceUpdateRequest struct {
	Company      string   `json:"company" validate:"required,min=2,max=500"`
	Position     string   `json:"position" validate:"required,min=2,max=500"`
	StartDate    string   `json:"start_date" validate:"required"`
	EndDate      string   `json:"end_date" validate:"required"`
	Description  string   `json:"description" validate:"required,min=10,max=5000"`
	Technologies []string `json:"technologies" validate:"required,min=1"`
	Location     string   `json:"location" validate:"omitempty,max=255"`
}