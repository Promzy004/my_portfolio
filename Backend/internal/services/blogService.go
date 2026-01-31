package services

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// BlogService handles blog business logic
type BlogService struct {
	repo *repositories.BlogRepository
}

// NewBlogService creates a new instance of BlogService
func NewBlogService(repo *repositories.BlogRepository) *BlogService {
	return &BlogService{repo: repo}
}

// GetAll retrieves all blogs with pagination
func (s *BlogService) GetAll(page, perPage int) ([]models.Blog, models.Pagination, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 15
	}

	blogs, total, err := s.repo.GetAll(page, perPage)
	if err != nil {
		return nil, models.Pagination{}, err
	}

	totalPages := (total + perPage - 1) / perPage

	pagination := models.Pagination{
		CurrentPage: page,
		PerPage:     perPage,
		Total:       total,
		TotalPages:  totalPages,
	}

	return blogs, pagination, nil
}

// GetByID retrieves a single blog by ID
func (s *BlogService) GetByID(id string) (*models.Blog, error) {
	return s.repo.GetByID(id)
}

// GetBySlug retrieves a single blog by slug
func (s *BlogService) GetBySlug(slug string) (*models.Blog, error) {
	return s.repo.GetBySlug(slug)
}

// Create creates a new blog post
func (s *BlogService) Create(req *models.BlogCreateRequest) (*models.Blog, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Validate blocks
	for _, block := range req.Blocks {
		if err := utils.ValidateStruct(&block); err != nil {
			return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
		}
		if err := block.ValidateBlockData(); err != nil {
			return nil, err
		}
	}

	// Check if slug already exists
	exists, err := s.repo.SlugExists(req.Slug, "")
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, models.ErrDuplicateKey
	}

	// Convert blocks to JSON
	blocksJSON, err := json.Marshal(req.Blocks)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal blocks: %w", err)
	}

	// Convert keywords to JSON if present
	var metaKeywordsJSON json.RawMessage
	if len(req.MetaKeywords) > 0 {
		keywordsBytes, err := json.Marshal(req.MetaKeywords)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal meta keywords: %w", err)
		}
		metaKeywordsJSON = keywordsBytes
	}

	// Create blog
	blog := &models.Blog{
		ID:              utils.GenerateID("blog"),
		Title:           req.Title,
		Excerpt:         req.Excerpt,
		Date:            req.Date,
		Slug:            req.Slug,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
		MetaImage:       req.MetaImage,
		MetaKeywords:    metaKeywordsJSON,
		Blocks:          blocksJSON,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	if err := s.repo.Create(blog); err != nil {
		return nil, err
	}

	return blog, nil
}

// Update modifies an existing blog post
func (s *BlogService) Update(id string, req *models.BlogUpdateRequest) (*models.Blog, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Validate blocks
	for _, block := range req.Blocks {
		if err := utils.ValidateStruct(&block); err != nil {
			return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
		}
		if err := block.ValidateBlockData(); err != nil {
			return nil, err
		}
	}

	// Check if blog exists
	existingBlog, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Check if slug already exists (excluding current blog)
	if req.Slug != existingBlog.Slug {
		exists, err := s.repo.SlugExists(req.Slug, id)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, models.ErrDuplicateKey
		}
	}

	// Convert blocks to JSON
	blocksJSON, err := json.Marshal(req.Blocks)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal blocks: %w", err)
	}

	// Convert keywords to JSON if present
	var metaKeywordsJSON json.RawMessage
	if len(req.MetaKeywords) > 0 {
		keywordsBytes, err := json.Marshal(req.MetaKeywords)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal meta keywords: %w", err)
		}
		metaKeywordsJSON = keywordsBytes
	}

	// Update blog
	blog := &models.Blog{
		ID:              id,
		Title:           req.Title,
		Excerpt:         req.Excerpt,
		Date:            req.Date,
		Slug:            req.Slug,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
		MetaImage:       req.MetaImage,
		MetaKeywords:    metaKeywordsJSON,
		Blocks:          blocksJSON,
		UpdatedAt:       time.Now(),
	}

	if err := s.repo.Update(blog); err != nil {
		return nil, err
	}

	return s.repo.GetByID(id)
}

// Delete removes a blog post
func (s *BlogService) Delete(id string) error {
	return s.repo.Delete(id)
}