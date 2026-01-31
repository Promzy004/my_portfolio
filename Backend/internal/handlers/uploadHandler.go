package handlers

import (
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

// UploadHandler handles HTTP requests for file uploads
type UploadHandler struct {
	service *services.CloudinaryService
}

// NewUploadHandler creates a new instance of UploadHandler
func NewUploadHandler(service *services.CloudinaryService) *UploadHandler {
	return &UploadHandler{service: service}
}

// UploadImage handles image upload to Cloudinary
func (h *UploadHandler) UploadImage(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form with max memory of 10MB
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to parse form data", err)
		return
	}

	// Retrieve file from form data
	file, header, err := r.FormFile("file")
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to read file from form data", err)
		return
	}
	defer file.Close()

	// Upload image to Cloudinary
	result, err := h.service.UploadImage(file, header)
	if err != nil {
		switch err {
		case models.ErrFileTooLarge:
			utils.SendError(w, http.StatusBadRequest, "File size exceeds maximum allowed (2MB)", err)
		case models.ErrInvalidFileType:
			utils.SendError(w, http.StatusBadRequest, "Invalid file type. Allowed types: jpg, jpeg, png, webp, svg", err)
		case models.ErrUploadFailed:
			utils.SendError(w, http.StatusInternalServerError, "Failed to upload image to Cloudinary", err)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Image upload failed", err)
		}
		return
	}

	utils.SendSuccess(w, http.StatusOK, "Image uploaded successfully", result)
}
