package utils

import (
	"encoding/json"
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
)

// SendSuccess sends a successful JSON response
func SendSuccess(w http.ResponseWriter, statusCode int, message string, data interface{}) {
	response := models.Response{
		Success: true,
		Message: message,
		Data:    data,
	}
	sendJSON(w, statusCode, response)
}

// SendError sends an error JSON response
func SendError(w http.ResponseWriter, statusCode int, message string, err error) {
	response := models.Response{
		Success: false,
		Message: message,
	}

	if err != nil {
		response.Error = err.Error()
	}

	sendJSON(w, statusCode, response)
}

// SendPaginated sends a paginated JSON response
func SendPaginated(w http.ResponseWriter, statusCode int, message string, data interface{}, pagination models.Pagination) {
	response := models.PaginatedResponse{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    pagination,
	}
	sendJSON(w, statusCode, response)
}

// sendJSON is a helper function to send JSON responses
func sendJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}
