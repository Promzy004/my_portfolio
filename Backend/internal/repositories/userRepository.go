package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// UserRepository handles database operations for users
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository creates a new instance of UserRepository
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetByEmail retrieves a user by email address
func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, updated_at
		FROM users
		WHERE email = ?
	`

	user := &models.User{}
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return user, nil
}

// GetByID retrieves a user by ID
func (r *UserRepository) GetByID(id string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, updated_at
		FROM users
		WHERE id = ?
	`

	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}

	return user, nil
}

// Create inserts a new user into the database
func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(query,
		user.ID,
		user.Email,
		user.Password,
		user.Name,
		user.CreatedAt,
		user.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// AdminExists checks if any admin user exists in the database
func (r *UserRepository) AdminExists() (bool, error) {
	query := `SELECT COUNT(*) FROM users`

	var count int
	err := r.db.QueryRow(query).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check admin exists: %w", err)
	}

	return count > 0, nil
}

// StoreRefreshToken stores a refresh token in the database
func (r *UserRepository) StoreRefreshToken(token *models.RefreshToken) error {
	query := `
		INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at)
		VALUES (?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(query,
		token.ID,
		token.UserID,
		token.Token,
		token.ExpiresAt,
		token.CreatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to store refresh token: %w", err)
	}

	return nil
}

// GetRefreshToken retrieves a refresh token from the database
func (r *UserRepository) GetRefreshToken(tokenString string) (*models.RefreshToken, error) {
	query := `
		SELECT id, user_id, token, expires_at, created_at
		FROM refresh_tokens
		WHERE token = ? AND expires_at > ?
	`

	token := &models.RefreshToken{}
	err := r.db.QueryRow(query, tokenString, time.Now()).Scan(
		&token.ID,
		&token.UserID,
		&token.Token,
		&token.ExpiresAt,
		&token.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get refresh token: %w", err)
	}

	return token, nil
}

// DeleteRefreshToken removes a refresh token from the database
func (r *UserRepository) DeleteRefreshToken(tokenString string) error {
	query := `DELETE FROM refresh_tokens WHERE token = ?`

	_, err := r.db.Exec(query, tokenString)
	if err != nil {
		return fmt.Errorf("failed to delete refresh token: %w", err)
	}

	return nil
}

// DeleteExpiredRefreshTokens removes all expired refresh tokens
func (r *UserRepository) DeleteExpiredRefreshTokens() error {
	query := `DELETE FROM refresh_tokens WHERE expires_at <= ?`

	_, err := r.db.Exec(query, time.Now())
	if err != nil {
		return fmt.Errorf("failed to delete expired tokens: %w", err)
	}

	return nil
}

// RecordLoginAttempt records a login attempt for rate limiting
func (r *UserRepository) RecordLoginAttempt(email string) error {
	query := `INSERT INTO login_attempts (email, attempted_at) VALUES (?, ?)`

	_, err := r.db.Exec(query, email, time.Now())
	if err != nil {
		return fmt.Errorf("failed to record login attempt: %w", err)
	}

	return nil
}

// GetLoginAttempts retrieves the number of login attempts within a time window
func (r *UserRepository) GetLoginAttempts(email string, since time.Time) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM login_attempts
		WHERE email = ? AND attempted_at > ?
	`

	var count int
	err := r.db.QueryRow(query, email, since).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to get login attempts: %w", err)
	}

	return count, nil
}

// ClearLoginAttempts removes login attempts for an email address
func (r *UserRepository) ClearLoginAttempts(email string) error {
	query := `DELETE FROM login_attempts WHERE email = ?`

	_, err := r.db.Exec(query, email)
	if err != nil {
		return fmt.Errorf("failed to clear login attempts: %w", err)
	}

	return nil
}
