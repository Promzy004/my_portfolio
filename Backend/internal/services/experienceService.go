package services

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// ExperienceService handles experience business logic
type ExperienceService struct {
	repo *repositories.ExperienceRepository
}

// NewExperienceService creates a new instance of ExperienceService
func NewExperienceService(repo *repositories.ExperienceRepository) *ExperienceService {
	return &ExperienceService{repo: repo}
}

// GetAll retrieves all experiences
func (s *ExperienceService) GetAll() ([]models.Experience, error) {
	return s.repo.GetAll()
}

// GetByID retrieves a single experience by ID
func (s *ExperienceService) GetByID(id string) (*models.Experience, error) {
	return s.repo.GetByID(id)
}

// Create creates a new experience
func (s *ExperienceService) Create(req *models.ExperienceCreateRequest) (*models.Experience, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Convert technologies to JSON for storage
	technologiesJSON, err := json.Marshal(req.Technologies)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal technologies: %w", err)
	}

	// Create experience
	experience := &models.Experience{
		ID:           utils.GenerateID("exp"),
		Company:      req.Company,
		Position:     req.Position,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		Description:  req.Description,
		Technologies: technologiesJSON,
		Location:     req.Location,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.repo.Create(experience); err != nil {
		return nil, err
	}

	return experience, nil
}

// Update modifies an existing experience
func (s *ExperienceService) Update(id string, req *models.ExperienceUpdateRequest) (*models.Experience, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Check if experience exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Convert technologies to JSON for storage
	technologiesJSON, err := json.Marshal(req.Technologies)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal technologies: %w", err)
	}

	// Update experience
	experience := &models.Experience{
		ID:           id,
		Company:      req.Company,
		Position:     req.Position,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		Description:  req.Description,
		Technologies: technologiesJSON,
		Location:     req.Location,
		UpdatedAt:    time.Now(),
	}

	if err := s.repo.Update(experience); err != nil {
		return nil, err
	}

	return s.repo.GetByID(id)
}

// Delete removes an experience
func (s *ExperienceService) Delete(id string) error {
	return s.repo.Delete(id)
}
