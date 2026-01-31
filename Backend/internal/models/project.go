package models

import (
	"encoding/json"
	"time"
)

// Project represents a portfolio project
type Project struct {
	ID          int             `json:"id" db:"id"`
	Name        string          `json:"name" db:"name" validate:"required,min=3,max=500"`
	Date        string          `json:"date" db:"date" validate:"required"`
	Link        string          `json:"link" db:"link" validate:"omitempty,url"`
	Tags        json.RawMessage `json:"tags" db:"tags" validate:"required"`
	Description string          `json:"desc" db:"description" validate:"required,min=10,max=5000"`
	Image       string          `json:"image" db:"image" validate:"omitempty,url"`
	Category    string          `json:"category" db:"category" validate:"required,oneof=web mobile desktop other"`
	CreatedAt   time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at" db:"updated_at"`
}

// ProjectCreateRequest represents the request to create a new project
type ProjectCreateRequest struct {
	Name        string   `json:"name" validate:"required,min=3,max=500"`
	Date        string   `json:"date" validate:"required"`
	Link        string   `json:"link" validate:"omitempty,url"`
	Tags        []string `json:"tags" validate:"required,min=1"`
	Description string   `json:"desc" validate:"required,min=10,max=5000"`
	Image       string   `json:"image" validate:"omitempty,url"`
	Category    string   `json:"category" validate:"required,oneof=web mobile desktop other"`
}

// ProjectUpdateRequest represents the request to update an existing project
type ProjectUpdateRequest struct {
	Name        string   `json:"name" validate:"required,min=3,max=500"`
	Date        string   `json:"date" validate:"required"`
	Link        string   `json:"link" validate:"omitempty,url"`
	Tags        []string `json:"tags" validate:"required,min=1"`
	Description string   `json:"desc" validate:"required,min=10,max=5000"`
	Image       string   `json:"image" validate:"omitempty,url"`
	Category    string   `json:"category" validate:"required,oneof=web mobile desktop other"`
}