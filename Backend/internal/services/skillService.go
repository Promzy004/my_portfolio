package services

import (
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// SkillService handles skill business logic
type SkillService struct {
	repo *repositories.SkillRepository
}

// NewSkillService creates a new instance of SkillService
func NewSkillService(repo *repositories.SkillRepository) *SkillService {
	return &SkillService{repo: repo}
}

// GetAll retrieves all skills
func (s *SkillService) GetAll() ([]models.Skill, error) {
	return s.repo.GetAll()
}

// GetByID retrieves a single skill by ID
func (s *SkillService) GetByID(id string) (*models.Skill, error) {
	return s.repo.GetByID(id)
}

// GetByCategory retrieves skills filtered by category
func (s *SkillService) GetByCategory(category string) ([]models.Skill, error) {
	return s.repo.GetByCategory(category)
}

// Create creates a new skill
func (s *SkillService) Create(req *models.SkillCreateRequest) (*models.Skill, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Create skill
	skill := &models.Skill{
		ID:        utils.GenerateID("skill"),
		Name:      req.Name,
		Icon:      req.Icon,
		Category:  req.Category,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.repo.Create(skill); err != nil {
		return nil, err
	}

	return skill, nil
}

// Update modifies an existing skill
func (s *SkillService) Update(id string, req *models.SkillUpdateRequest) (*models.Skill, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Check if skill exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update skill
	skill := &models.Skill{
		ID:        id,
		Name:      req.Name,
		Icon:      req.Icon,
		Category:  req.Category,
		UpdatedAt: time.Now(),
	}

	if err := s.repo.Update(skill); err != nil {
		return nil, err
	}

	return s.repo.GetByID(id)
}

// Delete removes a skill
func (s *SkillService) Delete(id string) error {
	return s.repo.Delete(id)
}
