package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
	"github.com/go-chi/chi/v5"
)

// ExperienceHandler handles HTTP requests for work experiences
type ExperienceHandler struct {
	service *services.ExperienceService
}

// NewExperienceHandler creates a new instance of ExperienceHandler
func NewExperienceHandler(service *services.ExperienceService) *ExperienceHandler {
	return &ExperienceHandler{service: service}
}

// GetAll retrieves all experiences
func (h *ExperienceHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	experiences, err := h.service.GetAll()
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve experiences", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Experiences retrieved successfully", experiences)
}

// GetByID retrieves a single experience by ID
func (h *ExperienceHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	experience, err := h.service.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Experience not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve experience", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Experience retrieved successfully", experience)
}

// Create creates a new experience
func (h *ExperienceHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.ExperienceCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	experience, err := h.service.Create(&req)
	if err != nil {
		switch err {
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to create experience", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusCreated, "Experience created successfully", experience)
}

// Update modifies an existing experience
func (h *ExperienceHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req models.ExperienceUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	experience, err := h.service.Update(id, &req)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			utils.SendError(w, http.StatusNotFound, "Experience not found", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to update experience", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Experience updated successfully", experience)
}

// Delete removes an experience
func (h *ExperienceHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.service.Delete(id); err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Experience not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to delete experience", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Experience deleted successfully", nil)
}
