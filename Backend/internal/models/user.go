package models

import "time"

// User represents an admin user in the system
type User struct {
	ID        string    `json:"id" db:"id"`
	Email     string    `json:"email" db:"email" validate:"required,email"`
	Password  string    `json:"-" db:"password_hash"`
	Name      string    `json:"name" db:"name" validate:"required,min=2,max=255"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// UserLoginRequest represents the login request payload
type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

// UserSetupRequest represents the initial admin setup request
type UserSetupRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Name     string `json:"name" validate:"required,min=2,max=255"`
}

// RefreshToken represents a refresh token stored in the database
type RefreshToken struct {
	ID        string    `json:"id" db:"id"`
	UserID    string    `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}