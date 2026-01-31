package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
	"github.com/go-chi/chi/v5"
)

// SocialHandler handles HTTP requests for social links
type SocialHandler struct {
	service *services.SocialService
}

// NewSocialHandler creates a new instance of SocialHandler
func NewSocialHandler(service *services.SocialService) *SocialHandler {
	return &SocialHandler{service: service}
}

// GetAll retrieves all social links
func (h *SocialHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	platform := r.URL.Query().Get("platform")

	var socials []models.Social
	var err error

	// Filter by platform if provided
	if platform != "" {
		socials, err = h.service.GetByPlatform(platform)
	} else {
		socials, err = h.service.GetAll()
	}

	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve social links", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Social links retrieved successfully", socials)
}

// GetByID retrieves a single social link by ID
func (h *SocialHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	social, err := h.service.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Social link not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve social link", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Social link retrieved successfully", social)
}

// Create creates a new social link
func (h *SocialHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.SocialCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	social, err := h.service.Create(&req)
	if err != nil {
		switch err {
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to create social link", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusCreated, "Social link created successfully", social)
}

// Update modifies an existing social link
func (h *SocialHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req models.SocialUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	social, err := h.service.Update(id, &req)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			utils.SendError(w, http.StatusNotFound, "Social link not found", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to update social link", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Social link updated successfully", social)
}

// Delete removes a social link
func (h *SocialHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.service.Delete(id); err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Social link not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to delete social link", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Social link deleted successfully", nil)
}
