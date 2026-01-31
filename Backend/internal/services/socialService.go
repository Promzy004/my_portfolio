package services

import (
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// SocialService handles social links business logic
type SocialService struct {
	repo *repositories.SocialRepository
}

// NewSocialService creates a new instance of SocialService
func NewSocialService(repo *repositories.SocialRepository) *SocialService {
	return &SocialService{repo: repo}
}

// GetAll retrieves all social links
func (s *SocialService) GetAll() ([]models.Social, error) {
	return s.repo.GetAll()
}

// GetByID retrieves a single social link by ID
func (s *SocialService) GetByID(id string) (*models.Social, error) {
	return s.repo.GetByID(id)
}

// GetByPlatform retrieves social links filtered by platform
func (s *SocialService) GetByPlatform(platform string) ([]models.Social, error) {
	return s.repo.GetByPlatform(platform)
}

// Create creates a new social link
func (s *SocialService) Create(req *models.SocialCreateRequest) (*models.Social, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Create social link
	social := &models.Social{
		ID:        utils.GenerateID("social"),
		Name:      req.Name,
		URL:       req.URL,
		Icon:      req.Icon,
		Platform:  req.Platform,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.repo.Create(social); err != nil {
		return nil, err
	}

	return social, nil
}

// Update modifies an existing social link
func (s *SocialService) Update(id string, req *models.SocialUpdateRequest) (*models.Social, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Check if social link exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update social link
	social := &models.Social{
		ID:        id,
		Name:      req.Name,
		URL:       req.URL,
		Icon:      req.Icon,
		Platform:  req.Platform,
		UpdatedAt: time.Now(),
	}

	if err := s.repo.Update(social); err != nil {
		return nil, err
	}

	return s.repo.GetByID(id)
}

// Delete removes a social link
func (s *SocialService) Delete(id string) error {
	return s.repo.Delete(id)
}
