package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// AuthHandler handles HTTP requests for authentication
type AuthHandler struct {
	service *services.AuthService
}

// NewAuthHandler creates a new instance of AuthHandler
func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

// Setup handles the initial admin setup endpoint
func (h *AuthHandler) Setup(w http.ResponseWriter, r *http.Request) {
	var req models.UserSetupRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	user, err := h.service.Setup(&req)
	if err != nil {
		switch err {
		case models.ErrAdminExists:
			utils.SendError(w, http.StatusConflict, "Admin user already exists", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to create admin user", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusCreated, "Admin user created successfully", user)
}

// Login handles user login and returns JWT tokens
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.UserLoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	user, accessToken, refreshToken, err := h.service.Login(&req)
	if err != nil {
		switch err {
		case models.ErrInvalidCredentials:
			utils.SendError(w, http.StatusUnauthorized, "Invalid email or password", err)
		case models.ErrTooManyRequests:
			utils.SendError(w, http.StatusTooManyRequests, "Too many login attempts. Please try again later", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Login failed", err)
		}
		return
	}

	response := map[string]interface{}{
		"user":          user,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"expires_in":    1800, // 30 minutes in seconds
	}

	utils.SendSuccess(w, http.StatusOK, "Login successful", response)
}

// RefreshToken handles token refresh requests
func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if req.RefreshToken == "" {
		utils.SendError(w, http.StatusBadRequest, "Refresh token is required", nil)
		return
	}

	accessToken, err := h.service.RefreshToken(req.RefreshToken)
	if err != nil {
		switch err {
		case models.ErrInvalidToken:
			utils.SendError(w, http.StatusUnauthorized, "Invalid refresh token", err)
		case models.ErrTokenExpired:
			utils.SendError(w, http.StatusUnauthorized, "Refresh token has expired", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to refresh token", err)
		}
		return
	}

	response := map[string]interface{}{
		"access_token": accessToken,
		"expires_in":   1800, // 30 minutes in seconds
	}

	utils.SendSuccess(w, http.StatusOK, "Token refreshed successfully", response)
}

// Logout handles user logout and invalidates refresh token
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if req.RefreshToken == "" {
		utils.SendError(w, http.StatusBadRequest, "Refresh token is required", nil)
		return
	}

	if err := h.service.Logout(req.RefreshToken); err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Logout failed", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Logout successful", nil)
}
