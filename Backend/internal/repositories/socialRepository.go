package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// SocialRepository handles database operations for social links
type SocialRepository struct {
	db *sql.DB
}

// NewSocialRepository creates a new instance of SocialRepository
func NewSocialRepository(db *sql.DB) *SocialRepository {
	return &SocialRepository{db: db}
}

// GetAll retrieves all social links
func (r *SocialRepository) GetAll() ([]models.Social, error) {
	query := `
		SELECT id, name, url, icon, platform, created_at, updated_at
		FROM socials
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to get socials: %w", err)
	}
	defer rows.Close()

	var socials []models.Social
	for rows.Next() {
		var social models.Social
		err := rows.Scan(
			&social.ID,
			&social.Name,
			&social.URL,
			&social.Icon,
			&social.Platform,
			&social.CreatedAt,
			&social.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan social: %w", err)
		}
		socials = append(socials, social)
	}

	return socials, nil
}

// GetByID retrieves a single social link by ID
func (r *SocialRepository) GetByID(id string) (*models.Social, error) {
	query := `
		SELECT id, name, url, icon, platform, created_at, updated_at
		FROM socials
		WHERE id = ?
	`

	social := &models.Social{}
	err := r.db.QueryRow(query, id).Scan(
		&social.ID,
		&social.Name,
		&social.URL,
		&social.Icon,
		&social.Platform,
		&social.CreatedAt,
		&social.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get social: %w", err)
	}

	return social, nil
}

// GetByPlatform retrieves social links filtered by platform
func (r *SocialRepository) GetByPlatform(platform string) ([]models.Social, error) {
	query := `
		SELECT id, name, url, icon, platform, created_at, updated_at
		FROM socials
		WHERE platform = ?
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query, platform)
	if err != nil {
		return nil, fmt.Errorf("failed to get socials by platform: %w", err)
	}
	defer rows.Close()

	var socials []models.Social
	for rows.Next() {
		var social models.Social
		err := rows.Scan(
			&social.ID,
			&social.Name,
			&social.URL,
			&social.Icon,
			&social.Platform,
			&social.CreatedAt,
			&social.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan social: %w", err)
		}
		socials = append(socials, social)
	}

	return socials, nil
}

// Create inserts a new social link into the database
func (r *SocialRepository) Create(social *models.Social) error {
	query := `
		INSERT INTO socials (id, name, url, icon, platform, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(query,
		social.ID,
		social.Name,
		social.URL,
		social.Icon,
		social.Platform,
		social.CreatedAt,
		social.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create social: %w", err)
	}

	return nil
}

// Update modifies an existing social link in the database
func (r *SocialRepository) Update(social *models.Social) error {
	query := `
		UPDATE socials
		SET name = ?, url = ?, icon = ?, platform = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.Exec(query,
		social.Name,
		social.URL,
		social.Icon,
		social.Platform,
		time.Now(),
		social.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update social: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return models.ErrNotFound
	}

	return nil
}

// Delete removes a social link from the database
func (r *SocialRepository) Delete(id string) error {
	query := `DELETE FROM socials WHERE id = ?`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete social: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return models.ErrNotFound
	}

	return nil
}
