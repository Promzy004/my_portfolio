package models

import (
	"encoding/json"
	"time"
)

// Blog represents a blog post in the system
type Blog struct {
	ID        string          `json:"id" db:"id"`
	Title     string          `json:"title" db:"title" validate:"required,min=3,max=500"`
	Excerpt   string          `json:"excerpt" db:"excerpt" validate:"required,min=10,max=1000"`
	Date      string          `json:"date" db:"date" validate:"required"`
	Slug      string          `json:"slug" db:"slug" validate:"required,min=3,max=500,slug"`
	
	// SEO Metadata (optional - will auto-generate if not provided)
	MetaTitle       string          `json:"meta_title,omitempty" db:"meta_title" validate:"omitempty,max=255"`
	MetaDescription string          `json:"meta_description,omitempty" db:"meta_description" validate:"omitempty,max=1000"`
	MetaImage       string          `json:"meta_image,omitempty" db:"meta_image" validate:"omitempty,url"`
	MetaKeywords    json.RawMessage `json:"meta_keywords,omitempty" db:"meta_keywords"`
	
	Blocks    json.RawMessage `json:"blocks" db:"blocks"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt time.Time       `json:"updated_at" db:"updated_at"`
}

// BlogBlock represents a single content block in a blog post
type BlogBlock struct {
	ID   string                 `json:"id" validate:"required"`
	Type string                 `json:"type" validate:"required,oneof=paragraph heading list code callout"`
	Data map[string]interface{} `json:"data" validate:"required"`
}

// BlogCreateRequest represents the request to create a new blog post
type BlogCreateRequest struct {
	Title           string      `json:"title" validate:"required,min=3,max=500"`
	Excerpt         string      `json:"excerpt" validate:"required,min=10,max=1000"`
	Date            string      `json:"date" validate:"required"`
	Slug            string      `json:"slug" validate:"required,min=3,max=500,slug"`
	MetaTitle       string      `json:"meta_title,omitempty" validate:"omitempty,max=255"`
	MetaDescription string      `json:"meta_description,omitempty" validate:"omitempty,max=1000"`
	MetaImage       string      `json:"meta_image,omitempty" validate:"omitempty,url"`
	MetaKeywords    []string    `json:"meta_keywords,omitempty"`
	Blocks          []BlogBlock `json:"blocks"`
}

// BlogUpdateRequest represents the request to update an existing blog post
type BlogUpdateRequest struct {
	Title           string      `json:"title" validate:"required,min=3,max=500"`
	Excerpt         string      `json:"excerpt" validate:"required,min=10,max=1000"`
	Date            string      `json:"date" validate:"required"`
	Slug            string      `json:"slug" validate:"required,min=3,max=500,slug"`
	MetaTitle       string      `json:"meta_title,omitempty" validate:"omitempty,max=255"`
	MetaDescription string      `json:"meta_description,omitempty" validate:"omitempty,max=1000"`
	MetaImage       string      `json:"meta_image,omitempty" validate:"omitempty,url"`
	MetaKeywords    []string    `json:"meta_keywords,omitempty"`
	Blocks          []BlogBlock `json:"blocks"`
}

// ValidateBlockData validates the data field based on block type
func (b *BlogBlock) ValidateBlockData() error {
	switch b.Type {
	case "paragraph", "callout":
		if _, ok := b.Data["text"].(string); !ok {
			return ErrInvalidBlockData
		}
	case "heading":
		if _, ok := b.Data["text"].(string); !ok {
			return ErrInvalidBlockData
		}
		if level, ok := b.Data["level"].(float64); !ok || (level != 2 && level != 3) {
			return ErrInvalidBlockData
		}
	case "list":
		items, ok := b.Data["items"].([]interface{})
		if !ok || len(items) == 0 {
			return ErrInvalidBlockData
		}
	case "code":
		if _, ok := b.Data["code"].(string); !ok {
			return ErrInvalidBlockData
		}
	}
	return nil
}