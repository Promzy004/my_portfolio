package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// BlogRepository handles database operations for blogs
type BlogRepository struct {
	db *sql.DB
}

// NewBlogRepository creates a new instance of BlogRepository
func NewBlogRepository(db *sql.DB) *BlogRepository {
	return &BlogRepository{db: db}
}

// GetAll retrieves all blogs with pagination
func (r *BlogRepository) GetAll(page, perPage int) ([]models.Blog, int, error) {
	offset := (page - 1) * perPage

	// Get total count
	var total int
	countQuery := `SELECT COUNT(*) FROM blogs`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get blog count: %w", err)
	}

	// Get paginated results
	query := `
		SELECT id, title, excerpt, date, slug, meta_title, meta_description, meta_image, meta_keywords, blocks, created_at, updated_at
		FROM blogs
		ORDER BY date DESC, created_at DESC
		LIMIT ? OFFSET ?
	`

	rows, err := r.db.Query(query, perPage, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get blogs: %w", err)
	}
	defer rows.Close()

	var blogs []models.Blog
	for rows.Next() {
		var blog models.Blog
		var metaTitle, metaDescription, metaImage sql.NullString
		var metaKeywords []byte
		
		err := rows.Scan(
			&blog.ID,
			&blog.Title,
			&blog.Excerpt,
			&blog.Date,
			&blog.Slug,
			&metaTitle,
			&metaDescription,
			&metaImage,
			&metaKeywords,
			&blog.Blocks,
			&blog.CreatedAt,
			&blog.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan blog: %w", err)
		}
		
		// Handle nullable metadata fields
		if metaTitle.Valid {
			blog.MetaTitle = metaTitle.String
		}
		if metaDescription.Valid {
			blog.MetaDescription = metaDescription.String
		}
		if metaImage.Valid {
			blog.MetaImage = metaImage.String
		}
		if len(metaKeywords) > 0 {
			blog.MetaKeywords = metaKeywords
		}
		
		blogs = append(blogs, blog)
	}

	return blogs, total, nil
}

// GetByID retrieves a single blog by ID
func (r *BlogRepository) GetByID(id string) (*models.Blog, error) {
	query := `
		SELECT id, title, excerpt, date, slug, meta_title, meta_description, meta_image, meta_keywords, blocks, created_at, updated_at
		FROM blogs
		WHERE id = ?
	`

	blog := &models.Blog{}
	var metaTitle, metaDescription, metaImage sql.NullString
	var metaKeywords []byte
	
	err := r.db.QueryRow(query, id).Scan(
		&blog.ID,
		&blog.Title,
		&blog.Excerpt,
		&blog.Date,
		&blog.Slug,
		&metaTitle,
		&metaDescription,
		&metaImage,
		&metaKeywords,
		&blog.Blocks,
		&blog.CreatedAt,
		&blog.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get blog: %w", err)
	}

	// Handle nullable metadata fields
	if metaTitle.Valid {
		blog.MetaTitle = metaTitle.String
	}
	if metaDescription.Valid {
		blog.MetaDescription = metaDescription.String
	}
	if metaImage.Valid {
		blog.MetaImage = metaImage.String
	}
	if len(metaKeywords) > 0 {
		blog.MetaKeywords = metaKeywords
	}

	return blog, nil
}

// GetBySlug retrieves a single blog by slug
func (r *BlogRepository) GetBySlug(slug string) (*models.Blog, error) {
	query := `
		SELECT id, title, excerpt, date, slug, meta_title, meta_description, meta_image, meta_keywords, blocks, created_at, updated_at
		FROM blogs
		WHERE slug = ?
	`

	blog := &models.Blog{}
	var metaTitle, metaDescription, metaImage sql.NullString
	var metaKeywords []byte
	
	err := r.db.QueryRow(query, slug).Scan(
		&blog.ID,
		&blog.Title,
		&blog.Excerpt,
		&blog.Date,
		&blog.Slug,
		&metaTitle,
		&metaDescription,
		&metaImage,
		&metaKeywords,
		&blog.Blocks,
		&blog.CreatedAt,
		&blog.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get blog by slug: %w", err)
	}

	// Handle nullable metadata fields
	if metaTitle.Valid {
		blog.MetaTitle = metaTitle.String
	}
	if metaDescription.Valid {
		blog.MetaDescription = metaDescription.String
	}
	if metaImage.Valid {
		blog.MetaImage = metaImage.String
	}
	if len(metaKeywords) > 0 {
		blog.MetaKeywords = metaKeywords
	}

	return blog, nil
}

// Create inserts a new blog into the database
func (r *BlogRepository) Create(blog *models.Blog) error {
	// Convert blocks to JSON
	blocksJSON, err := json.Marshal(blog.Blocks)
	if err != nil {
		return fmt.Errorf("failed to marshal blocks: %w", err)
	}

	// Convert keywords to JSON if present
	var metaKeywordsJSON []byte
	if len(blog.MetaKeywords) > 0 {
		metaKeywordsJSON, err = json.Marshal(blog.MetaKeywords)
		if err != nil {
			return fmt.Errorf("failed to marshal meta keywords: %w", err)
		}
	}

	query := `
		INSERT INTO blogs (id, title, excerpt, date, slug, meta_title, meta_description, meta_image, meta_keywords, blocks, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err = r.db.Exec(query,
		blog.ID,
		blog.Title,
		blog.Excerpt,
		blog.Date,
		blog.Slug,
		sql.NullString{String: blog.MetaTitle, Valid: blog.MetaTitle != ""},
		sql.NullString{String: blog.MetaDescription, Valid: blog.MetaDescription != ""},
		sql.NullString{String: blog.MetaImage, Valid: blog.MetaImage != ""},
		metaKeywordsJSON,
		blocksJSON,
		blog.CreatedAt,
		blog.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create blog: %w", err)
	}

	return nil
}

// Update modifies an existing blog in the database
func (r *BlogRepository) Update(blog *models.Blog) error {
	// Convert blocks to JSON
	blocksJSON, err := json.Marshal(blog.Blocks)
	if err != nil {
		return fmt.Errorf("failed to marshal blocks: %w", err)
	}

	// Convert keywords to JSON if present
	var metaKeywordsJSON []byte
	if len(blog.MetaKeywords) > 0 {
		metaKeywordsJSON, err = json.Marshal(blog.MetaKeywords)
		if err != nil {
			return fmt.Errorf("failed to marshal meta keywords: %w", err)
		}
	}

	query := `
		UPDATE blogs
		SET title = ?, excerpt = ?, date = ?, slug = ?, meta_title = ?, meta_description = ?, meta_image = ?, meta_keywords = ?, blocks = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.Exec(query,
		blog.Title,
		blog.Excerpt,
		blog.Date,
		blog.Slug,
		sql.NullString{String: blog.MetaTitle, Valid: blog.MetaTitle != ""},
		sql.NullString{String: blog.MetaDescription, Valid: blog.MetaDescription != ""},
		sql.NullString{String: blog.MetaImage, Valid: blog.MetaImage != ""},
		metaKeywordsJSON,
		blocksJSON,
		time.Now(),
		blog.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update blog: %w", err)
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

// Delete removes a blog from the database
func (r *BlogRepository) Delete(id string) error {
	query := `DELETE FROM blogs WHERE id = ?`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete blog: %w", err)
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

// SlugExists checks if a slug already exists (excluding a specific blog ID)
func (r *BlogRepository) SlugExists(slug, excludeID string) (bool, error) {
	query := `SELECT COUNT(*) FROM blogs WHERE slug = ? AND id != ?`

	var count int
	err := r.db.QueryRow(query, slug, excludeID).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check slug exists: %w", err)
	}

	return count > 0, nil
}