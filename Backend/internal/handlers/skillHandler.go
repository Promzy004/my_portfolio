package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
	"github.com/go-chi/chi/v5"
)

// SkillHandler handles HTTP requests for skills
type SkillHandler struct {
	service *services.SkillService
}

// NewSkillHandler creates a new instance of SkillHandler
func NewSkillHandler(service *services.SkillService) *SkillHandler {
	return &SkillHandler{service: service}
}

// GetAll retrieves all skills
func (h *SkillHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")

	var skills []models.Skill
	var err error

	// Filter by category if provided
	if category != "" {
		skills, err = h.service.GetByCategory(category)
	} else {
		skills, err = h.service.GetAll()
	}

	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve skills", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Skills retrieved successfully", skills)
}

// GetByID retrieves a single skill by ID
func (h *SkillHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	skill, err := h.service.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Skill not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve skill", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Skill retrieved successfully", skill)
}

// Create creates a new skill
func (h *SkillHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.SkillCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	skill, err := h.service.Create(&req)
	if err != nil {
		switch err {
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to create skill", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusCreated, "Skill created successfully", skill)
}

// Update modifies an existing skill
func (h *SkillHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req models.SkillUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	skill, err := h.service.Update(id, &req)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			utils.SendError(w, http.StatusNotFound, "Skill not found", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to update skill", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Skill updated successfully", skill)
}

// Delete removes a skill
func (h *SkillHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.service.Delete(id); err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Skill not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to delete skill", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Skill deleted successfully", nil)
}
