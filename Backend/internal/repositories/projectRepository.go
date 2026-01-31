package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// ProjectRepository handles database operations for projects
type ProjectRepository struct {
	db *sql.DB
}

// NewProjectRepository creates a new instance of ProjectRepository
func NewProjectRepository(db *sql.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

// GetAll retrieves all projects with pagination
func (r *ProjectRepository) GetAll(page, perPage int) ([]models.Project, int, error) {
	offset := (page - 1) * perPage

	// Get total count
	var total int
	countQuery := `SELECT COUNT(*) FROM projects`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get project count: %w", err)
	}

	// Get paginated results
	query := `
		SELECT id, name, date, link, tags, description, image, category, created_at, updated_at
		FROM projects
		ORDER BY date DESC, created_at DESC
		LIMIT ? OFFSET ?
	`

	rows, err := r.db.Query(query, perPage, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get projects: %w", err)
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var project models.Project
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Date,
			&project.Link,
			&project.Tags,
			&project.Description,
			&project.Image,
			&project.Category,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan project: %w", err)
		}
		projects = append(projects, project)
	}

	return projects, total, nil
}

// GetByID retrieves a single project by ID
func (r *ProjectRepository) GetByID(id int) (*models.Project, error) {
	query := `
		SELECT id, name, date, link, tags, description, image, category, created_at, updated_at
		FROM projects
		WHERE id = ?
	`

	project := &models.Project{}
	err := r.db.QueryRow(query, id).Scan(
		&project.ID,
		&project.Name,
		&project.Date,
		&project.Link,
		&project.Tags,
		&project.Description,
		&project.Image,
		&project.Category,
		&project.CreatedAt,
		&project.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get project: %w", err)
	}

	return project, nil
}

// GetByCategory retrieves projects filtered by category with pagination
func (r *ProjectRepository) GetByCategory(category string, page, perPage int) ([]models.Project, int, error) {
	offset := (page - 1) * perPage

	// Get total count
	var total int
	countQuery := `SELECT COUNT(*) FROM projects WHERE category = ?`
	err := r.db.QueryRow(countQuery, category).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get project count by category: %w", err)
	}

	// Get paginated results
	query := `
		SELECT id, name, date, link, tags, description, image, category, created_at, updated_at
		FROM projects
		WHERE category = ?
		ORDER BY date DESC, created_at DESC
		LIMIT ? OFFSET ?
	`

	rows, err := r.db.Query(query, category, perPage, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get projects by category: %w", err)
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var project models.Project
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Date,
			&project.Link,
			&project.Tags,
			&project.Description,
			&project.Image,
			&project.Category,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan project: %w", err)
		}
		projects = append(projects, project)
	}

	return projects, total, nil
}

// Create inserts a new project into the database
func (r *ProjectRepository) Create(project *models.Project) error {
	// Convert tags to JSON
	tagsJSON, err := json.Marshal(project.Tags)
	if err != nil {
		return fmt.Errorf("failed to marshal tags: %w", err)
	}

	query := `
		INSERT INTO projects (name, date, link, tags, description, image, category, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := r.db.Exec(query,
		project.Name,
		project.Date,
		project.Link,
		tagsJSON,
		project.Description,
		project.Image,
		project.Category,
		project.CreatedAt,
		project.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create project: %w", err)
	}

	// Get the auto-incremented ID
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert ID: %w", err)
	}

	project.ID = int(id)
	return nil
}

// Update modifies an existing project in the database
func (r *ProjectRepository) Update(project *models.Project) error {
	// Convert tags to JSON
	tagsJSON, err := json.Marshal(project.Tags)
	if err != nil {
		return fmt.Errorf("failed to marshal tags: %w", err)
	}

	query := `
		UPDATE projects
		SET name = ?, date = ?, link = ?, tags = ?, description = ?, image = ?, category = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.Exec(query,
		project.Name,
		project.Date,
		project.Link,
		tagsJSON,
		project.Description,
		project.Image,
		project.Category,
		time.Now(),
		project.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update project: %w", err)
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

// Delete removes a project from the database
func (r *ProjectRepository) Delete(id int) error {
	query := `DELETE FROM projects WHERE id = ?`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
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
