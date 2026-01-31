package services

import (
	"fmt"
	"time"

	"github.com/Promzy004/my_portfolio/config"
	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/repositories"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// AuthService handles authentication business logic
type AuthService struct {
	userRepo *repositories.UserRepository
	jwtCfg   *config.JWTConfig
	rateCfg  *config.RateLimitConfig
}

// NewAuthService creates a new instance of AuthService
func NewAuthService(userRepo *repositories.UserRepository, jwtCfg *config.JWTConfig, rateCfg *config.RateLimitConfig) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		jwtCfg:   jwtCfg,
		rateCfg:  rateCfg,
	}
}

// Setup creates the initial admin user (one-time operation)
func (s *AuthService) Setup(req *models.UserSetupRequest) (*models.User, error) {
	// Check if admin already exists
	exists, err := s.userRepo.AdminExists()
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, models.ErrAdminExists
	}

	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user
	user := &models.User{
		ID:        utils.GenerateID("user"),
		Email:     req.Email,
		Password:  hashedPassword,
		Name:      req.Name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Clear password from response
	user.Password = ""
	return user, nil
}

// Login authenticates a user and returns tokens
func (s *AuthService) Login(req *models.UserLoginRequest) (*models.User, string, string, error) {
	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		return nil, "", "", fmt.Errorf("%w: %v", models.ErrInvalidInput, err)
	}

	// Check rate limiting
	since := time.Now().Add(-s.rateCfg.LoginWindow)
	attempts, err := s.userRepo.GetLoginAttempts(req.Email, since)
	if err != nil {
		return nil, "", "", err
	}

	if attempts >= s.rateCfg.LoginLimit {
		return nil, "", "", models.ErrTooManyRequests
	}

	// Record login attempt
	if err := s.userRepo.RecordLoginAttempt(req.Email); err != nil {
		return nil, "", "", err
	}

	// Get user by email
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		if err == models.ErrNotFound {
			return nil, "", "", models.ErrInvalidCredentials
		}
		return nil, "", "", err
	}

	// Verify password
	if err := utils.VerifyPassword(user.Password, req.Password); err != nil {
		return nil, "", "", models.ErrInvalidCredentials
	}

	// Clear login attempts on successful login
	if err := s.userRepo.ClearLoginAttempts(req.Email); err != nil {
		return nil, "", "", err
	}

	// Generate tokens
	accessToken, err := utils.GenerateAccessToken(user, s.jwtCfg)
	if err != nil {
		return nil, "", "", fmt.Errorf("failed to generate access token: %w", err)
	}

	refreshToken, err := utils.GenerateRefreshToken(user, s.jwtCfg)
	if err != nil {
		return nil, "", "", fmt.Errorf("failed to generate refresh token: %w", err)
	}

	// Store refresh token
	tokenModel := &models.RefreshToken{
		ID:        utils.GenerateID("token"),
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(s.jwtCfg.RefreshExpiry),
		CreatedAt: time.Now(),
	}

	if err := s.userRepo.StoreRefreshToken(tokenModel); err != nil {
		return nil, "", "", err
	}

	// Clear password from response
	user.Password = ""
	return user, accessToken, refreshToken, nil
}

// RefreshToken generates a new access token using a valid refresh token
func (s *AuthService) RefreshToken(refreshToken string) (string, error) {
	// Validate refresh token
	claims, err := utils.ValidateToken(refreshToken, s.jwtCfg)
	if err != nil {
		return "", models.ErrInvalidToken
	}

	// Check if refresh token exists in database
	storedToken, err := s.userRepo.GetRefreshToken(refreshToken)
	if err != nil {
		if err == models.ErrNotFound {
			return "", models.ErrInvalidToken
		}
		return "", err
	}

	// Check if token is expired
	if storedToken.ExpiresAt.Before(time.Now()) {
		return "", models.ErrTokenExpired
	}

	// Get user
	user, err := s.userRepo.GetByID(claims.UserID)
	if err != nil {
		return "", err
	}

	// Generate new access token
	accessToken, err := utils.GenerateAccessToken(user, s.jwtCfg)
	if err != nil {
		return "", fmt.Errorf("failed to generate access token: %w", err)
	}

	return accessToken, nil
}

// Logout invalidates a refresh token
func (s *AuthService) Logout(refreshToken string) error {
	return s.userRepo.DeleteRefreshToken(refreshToken)
}

// ValidateAccessToken validates an access token and returns the user ID
func (s *AuthService) ValidateAccessToken(token string) (string, error) {
	claims, err := utils.ValidateToken(token, s.jwtCfg)
	if err != nil {
		return "", err
	}

	return claims.UserID, nil
}

// CleanupExpiredTokens removes expired refresh tokens from the database
func (s *AuthService) CleanupExpiredTokens() error {
	return s.userRepo.DeleteExpiredRefreshTokens()
}
