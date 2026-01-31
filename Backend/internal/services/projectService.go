package services

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// ProjectService handles project business logic
type ProjectService struct {
	repo *repositories.ProjectRepository
}

// NewProjectService creates a new instance of ProjectService
func NewProjectService(repo *repositories.ProjectRepository) *ProjectService {
	return &ProjectService{repo: repo}
}

// GetAll retrieves all projects with pagination
func (s *ProjectService) GetAll(page, perPage int) ([]models.Project, models.Pagination, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 15
	}

	projects, total, err := s.repo.GetAll(page, perPage)
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

	return projects, pagination, nil
}

// GetByID retrieves a single project by ID
func (s *ProjectService) GetByID(id int) (*models.Project, error) {
	return s.repo.GetByID(id)
}

// GetByCategory retrieves projects filtered by category with pagination
func (s *ProjectService) GetByCategory(category string, page, perPage int) ([]models.Project, models.Pagination, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 15
	}

	projects, total, err := s.repo.GetByCategory(category, page, perPage)
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

	return projects, pagination, nil
}

// Create creates a new project
func (s *ProjectService) Create(req *models.ProjectCreateRequest) (*models.Project, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Convert tags to JSON for storage
	tagsJSON, err := json.Marshal(req.Tags)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal tags: %w", err)
	}

	// Create project
	project := &models.Project{
		Name:        req.Name,
		Date:        req.Date,
		Link:        req.Link,
		Tags:        tagsJSON,
		Description: req.Description,
		Image:       req.Image,
		Category:    req.Category,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.repo.Create(project); err != nil {
		return nil, err
	}

	return project, nil
}

// Update modifies an existing project
func (s *ProjectService) Update(id int, req *models.ProjectUpdateRequest) (*models.Project, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Check if project exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Convert tags to JSON for storage
	tagsJSON, err := json.Marshal(req.Tags)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal tags: %w", err)
	}

	// Update project
	project := &models.Project{
		ID:          id,
		Name:        req.Name,
		Date:        req.Date,
		Link:        req.Link,
		Tags:        tagsJSON,
		Description: req.Description,
		Image:       req.Image,
		Category:    req.Category,
		UpdatedAt:   time.Now(),
	}

	if err := s.repo.Update(project); err != nil {
		return nil, err
	}

	return s.repo.GetByID(id)
}

// Delete removes a project
func (s *ProjectService) Delete(id int) error {
	return s.repo.Delete(id)
}
