package middlewares

import (
	"context"
	"net/http"

	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/Promzy004/my_portfolio/internal/services"
	"github.com/Promzy004/my_portfolio/internal/utils"
)

type contextKey string

const UserIDKey contextKey = "userID"

// AuthMiddleware handles JWT authentication
type AuthMiddleware struct {
	authService *services.AuthService
}

// NewAuthMiddleware creates a new instance of AuthMiddleware
func NewAuthMiddleware(authService *services.AuthService) *AuthMiddleware {
	return &AuthMiddleware{authService: authService}
}

// RequireAuth middleware validates JWT token and sets user ID in context
func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract token from Authorization header
		authHeader := r.Header.Get("Authorization")
		token, err := utils.ExtractTokenFromHeader(authHeader)
		if err != nil {
			utils.SendError(w, http.StatusUnauthorized, "Missing or invalid authorization header", err)
			return
		}

		// Validate token
		userID, err := m.authService.ValidateAccessToken(token)
		if err != nil {
			switch err {
			case models.ErrTokenExpired:
				utils.SendError(w, http.StatusUnauthorized, "Token has expired", err)
			case models.ErrInvalidToken:
				utils.SendError(w, http.StatusUnauthorized, "Invalid token", err)
			default:
				utils.SendError(w, http.StatusUnauthorized, "Authentication failed", err)
			}
			return
		}

		// Add user ID to request context
		ctx := context.WithValue(r.Context(), UserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserIDFromContext retrieves the user ID from request context
func GetUserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}
