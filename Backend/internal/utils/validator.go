package utils

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

// InitValidator initializes the validator with custom validation rules
func InitValidator() *validator.Validate {
	validate = validator.New()

	// Register custom validation for slug format
	validate.RegisterValidation("slug", validateSlug)

	return validate
}

// validateSlug validates that a string is a valid URL slug
func validateSlug(fl validator.FieldLevel) bool {
	slug := fl.Field().String()
	// Slug should contain only lowercase letters, numbers, and hyphens
	slugRegex := regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)
	return slugRegex.MatchString(slug)
}

// ValidateStruct validates a struct using the validator instance
func ValidateStruct(s interface{}) error {
	if validate == nil {
		validate = InitValidator()
	}
	return validate.Struct(s)
}