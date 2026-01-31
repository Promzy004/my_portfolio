package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// ExperienceRepository handles database operations for work experiences
type ExperienceRepository struct {
	db *sql.DB
}

// NewExperienceRepository creates a new instance of ExperienceRepository
func NewExperienceRepository(db *sql.DB) *ExperienceRepository {
	return &ExperienceRepository{db: db}
}

// GetAll retrieves all experiences ordered by end date
func (r *ExperienceRepository) GetAll() ([]models.Experience, error) {
	query := `
		SELECT id, company, position, start_date, end_date, description, technologies, location, created_at, updated_at
		FROM experiences
		ORDER BY 
			CASE WHEN end_date = 'Present' THEN 0 ELSE 1 END,
			end_date DESC,
			start_date DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to get experiences: %w", err)
	}
	defer rows.Close()

	var experiences []models.Experience
	for rows.Next() {
		var experience models.Experience
		var location sql.NullString

		err := rows.Scan(
			&experience.ID,
			&experience.Company,
			&experience.Position,
			&experience.StartDate,
			&experience.EndDate,
			&experience.Description,
			&experience.Technologies,
			&location,
			&experience.CreatedAt,
			&experience.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan experience: %w", err)
		}

		if location.Valid {
			experience.Location = location.String
		}

		experiences = append(experiences, experience)
	}

	return experiences, nil
}

// GetByID retrieves a single experience by ID
func (r *ExperienceRepository) GetByID(id string) (*models.Experience, error) {
	query := `
		SELECT id, company, position, start_date, end_date, description, technologies, location, created_at, updated_at
		FROM experiences
		WHERE id = ?
	`

	experience := &models.Experience{}
	var location sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&experience.ID,
		&experience.Company,
		&experience.Position,
		&experience.StartDate,
		&experience.EndDate,
		&experience.Description,
		&experience.Technologies,
		&location,
		&experience.CreatedAt,
		&experience.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get experience: %w", err)
	}

	if location.Valid {
		experience.Location = location.String
	}

	return experience, nil
}

// Create inserts a new experience into the database
func (r *ExperienceRepository) Create(experience *models.Experience) error {
	// Convert technologies to JSON
	technologiesJSON, err := json.Marshal(experience.Technologies)
	if err != nil {
		return fmt.Errorf("failed to marshal technologies: %w", err)
	}

	query := `
		INSERT INTO experiences (id, company, position, start_date, end_date, description, technologies, location, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err = r.db.Exec(query,
		experience.ID,
		experience.Company,
		experience.Position,
		experience.StartDate,
		experience.EndDate,
		experience.Description,
		technologiesJSON,
		sql.NullString{String: experience.Location, Valid: experience.Location != ""},
		experience.CreatedAt,
		experience.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create experience: %w", err)
	}

	return nil
}

// Update modifies an existing experience in the database
func (r *ExperienceRepository) Update(experience *models.Experience) error {
	// Convert technologies to JSON
	technologiesJSON, err := json.Marshal(experience.Technologies)
	if err != nil {
		return fmt.Errorf("failed to marshal technologies: %w", err)
	}

	query := `
		UPDATE experiences
		SET company = ?, position = ?, start_date = ?, end_date = ?, description = ?, technologies = ?, location = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.Exec(query,
		experience.Company,
		experience.Position,
		experience.StartDate,
		experience.EndDate,
		experience.Description,
		technologiesJSON,
		sql.NullString{String: experience.Location, Valid: experience.Location != ""},
		time.Now(),
		experience.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update experience: %w", err)
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

// Delete removes an experience from the database
func (r *ExperienceRepository) Delete(id string) error {
	query := `DELETE FROM experiences WHERE id = ?`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete experience: %w", err)
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
