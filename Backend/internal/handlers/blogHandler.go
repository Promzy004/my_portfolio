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

// BlogHandler handles HTTP requests for blogs
type BlogHandler struct {
	service *services.BlogService
}

// NewBlogHandler creates a new instance of BlogHandler
func NewBlogHandler(service *services.BlogService) *BlogHandler {
	return &BlogHandler{service: service}
}

// GetAll retrieves all blogs with pagination
func (h *BlogHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	perPage, _ := strconv.Atoi(r.URL.Query().Get("per_page"))

	// Set defaults if not provided
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 15
	}

	blogs, pagination, err := h.service.GetAll(page, perPage)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve blogs", err)
		return
	}

	utils.SendPaginated(w, http.StatusOK, "Blogs retrieved successfully", blogs, pagination)
}

// GetByID retrieves a single blog by ID
func (h *BlogHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	blog, err := h.service.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Blog not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to retrieve blog", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Blog retrieved successfully", blog)
}

// Create creates a new blog post
func (h *BlogHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.BlogCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	blog, err := h.service.Create(&req)
	if err != nil {
		switch err {
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		case models.ErrDuplicateKey:
			utils.SendError(w, http.StatusConflict, "Blog with this slug already exists", err)
		case models.ErrInvalidBlockData:
			utils.SendError(w, http.StatusBadRequest, "Invalid block data structure", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to create blog", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusCreated, "Blog created successfully", blog)
}

// Update modifies an existing blog post
func (h *BlogHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req models.BlogUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	blog, err := h.service.Update(id, &req)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			utils.SendError(w, http.StatusNotFound, "Blog not found", err)
		case models.ErrInvalidInput:
			utils.SendError(w, http.StatusBadRequest, "Invalid input data", err)
		case models.ErrDuplicateKey:
			utils.SendError(w, http.StatusConflict, "Blog with this slug already exists", err)
		case models.ErrInvalidBlockData:
			utils.SendError(w, http.StatusBadRequest, "Invalid block data structure", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to update blog", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Blog updated successfully", blog)
}

// Delete removes a blog post
func (h *BlogHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.service.Delete(id); err != nil {
		if err == models.ErrNotFound {
			utils.SendError(w, http.StatusNotFound, "Blog not found", err)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to delete blog", err)
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Blog deleted successfully", nil)
}
