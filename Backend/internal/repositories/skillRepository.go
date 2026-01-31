package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// SkillRepository handles database operations for skills
type SkillRepository struct {
	db *sql.DB
}

// NewSkillRepository creates a new instance of SkillRepository
func NewSkillRepository(db *sql.DB) *SkillRepository {
	return &SkillRepository{db: db}
}

// GetAll retrieves all skills
func (r *SkillRepository) GetAll() ([]models.Skill, error) {
	query := `
		SELECT id, name, icon, category, created_at, updated_at
		FROM skills
		ORDER BY name ASC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to get skills: %w", err)
	}
	defer rows.Close()

	var skills []models.Skill
	for rows.Next() {
		var skill models.Skill
		var category sql.NullString

		err := rows.Scan(
			&skill.ID,
			&skill.Name,
			&skill.Icon,
			&category,
			&skill.CreatedAt,
			&skill.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan skill: %w", err)
		}

		if category.Valid {
			skill.Category = category.String
		}

		skills = append(skills, skill)
	}

	return skills, nil
}

// GetByID retrieves a single skill by ID
func (r *SkillRepository) GetByID(id string) (*models.Skill, error) {
	query := `
		SELECT id, name, icon, category, created_at, updated_at
		FROM skills
		WHERE id = ?
	`

	skill := &models.Skill{}
	var category sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&skill.ID,
		&skill.Name,
		&skill.Icon,
		&category,
		&skill.CreatedAt,
		&skill.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get skill: %w", err)
	}

	if category.Valid {
		skill.Category = category.String
	}

	return skill, nil
}

// GetByCategory retrieves skills filtered by category
func (r *SkillRepository) GetByCategory(categoryName string) ([]models.Skill, error) {
	query := `
		SELECT id, name, icon, category, created_at, updated_at
		FROM skills
		WHERE category = ?
		ORDER BY name ASC
	`

	rows, err := r.db.Query(query, categoryName)
	if err != nil {
		return nil, fmt.Errorf("failed to get skills by category: %w", err)
	}
	defer rows.Close()

	var skills []models.Skill
	for rows.Next() {
		var skill models.Skill
		var category sql.NullString

		err := rows.Scan(
			&skill.ID,
			&skill.Name,
			&skill.Icon,
			&category,
			&skill.CreatedAt,
			&skill.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan skill: %w", err)
		}

		if category.Valid {
			skill.Category = category.String
		}

		skills = append(skills, skill)
	}

	return skills, nil
}

// Create inserts a new skill into the database
func (r *SkillRepository) Create(skill *models.Skill) error {
	query := `
		INSERT INTO skills (id, name, icon, category, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(query,
		skill.ID,
		skill.Name,
		skill.Icon,
		sql.NullString{String: skill.Category, Valid: skill.Category != ""},
		skill.CreatedAt,
		skill.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create skill: %w", err)
	}

	return nil
}

// Update modifies an existing skill in the database
func (r *SkillRepository) Update(skill *models.Skill) error {
	query := `
		UPDATE skills
		SET name = ?, icon = ?, category = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.Exec(query,
		skill.Name,
		skill.Icon,
		sql.NullString{String: skill.Category, Valid: skill.Category != ""},
		time.Now(),
		skill.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update skill: %w", err)
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

// Delete removes a skill from the database
func (r *SkillRepository) Delete(id string) error {
	query := `DELETE FROM skills WHERE id = ?`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete skill: %w", err)
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
