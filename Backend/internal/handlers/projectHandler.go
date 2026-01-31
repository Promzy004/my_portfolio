package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
	"github.com/go-chi/chi/v5"
)

// ProjectHandler handles HTTP requests for projects
type ProjectHandler struct {
	service *services.ProjectService
}

// NewProjectHandler creates a new instance of ProjectHandler
func NewProjectHandler(service *services.ProjectService) *ProjectHandler {
	return &ProjectHandler{service: service}
}

// GetAll retrieves all projects with pagination
func (h *ProjectHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	perPage, _ := strconv.Atoi(r.URL.Query().Get("per_page"))
	category := r.URL.Query().Get("category")

	// Set defaults if not provided
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 15
	}

	var projects []models.Project
	var pagination models.Pagination
	var err error

	// Filter by category if provided
	if category != "" {
		projects, pagination, err = h.service.GetByCategory(category, page, perPage)
	} else {
		projects, pagination, err = h.service.GetAll(page, perPage)
	}

	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve projects", err)
		return
	}

	utils.SendPaginated(w, http.StatusOK, "Projects retrieved successfully", projects, pagination)
}

// GetByID retrieves a single project by ID
func (h *ProjectHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid project ID", err)
		return
	}

	project, err := h.service.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Project not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve project", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Project retrieved successfully", project)
}

// Create creates a new project
func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.ProjectCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	project, err := h.service.Create(&req)
	if err != nil {
		switch err {
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to create project", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusCreated, "Project created successfully", project)
}

// Update modifies an existing project
func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid project ID", err)
		return
	}

	var req models.ProjectUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	project, err := h.service.Update(id, &req)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			utils.SendError(w, http.StatusNotFound, "Project not found", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to update project", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Project updated successfully", project)
}

// Delete removes a project
func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid project ID", err)
		return
	}

	if err := h.service.Delete(id); err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Project not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to delete project", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Project deleted successfully", nil)
}
