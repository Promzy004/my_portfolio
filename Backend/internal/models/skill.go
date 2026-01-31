package models

import "time"

// Skill represents a technical skill with an SVG icon
type Skill struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name" validate:"required,min=2,max=255"`
	Icon      string    `json:"icon" db:"icon" validate:"required"`
	Category  string    `json:"category" db:"category" validate:"omitempty,max=255"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// SkillCreateRequest represents the request to create a new skill
type SkillCreateRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=255"`
	Icon     string `json:"icon" validate:"required"`
	Category string `json:"category" validate:"omitempty,max=255"`
}

// SkillUpdateRequest represents the request to update an existing skill
type SkillUpdateRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=255"`
	Icon     string `json:"icon" validate:"required"`
	Category string `json:"category" validate:"omitempty,max=255"`
}