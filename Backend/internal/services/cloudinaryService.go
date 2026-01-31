package services

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"github.com/Promzy004/my_portfolio/config"
	"github.com/Promzy004/my_portfolio/internal/models"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

// CloudinaryService handles image upload to Cloudinary
type CloudinaryService struct {
	cld    *cloudinary.Cloudinary
	folder string
	cfg    *config.FileUploadConfig
}

// UploadResult contains the result of an image upload
type UploadResult struct {
	URL      string `json:"url"`
	PublicID string `json:"public_id"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
	Format   string `json:"format"`
	Size     int64  `json:"size"`
}

// NewCloudinaryService creates a new instance of CloudinaryService
func NewCloudinaryService(cloudCfg *config.CloudinaryConfig, fileCfg *config.FileUploadConfig) (*CloudinaryService, error) {
	cld, err := cloudinary.NewFromParams(
		cloudCfg.CloudName,
		cloudCfg.APIKey,
		cloudCfg.APISecret,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryService{
		cld:    cld,
		folder: cloudCfg.UploadFolder,
		cfg:    fileCfg,
	}, nil
}

// UploadImage uploads an image file to Cloudinary with optimization
func (s *CloudinaryService) UploadImage(file multipart.File, header *multipart.FileHeader) (*UploadResult, error) {
	// Validate file size
	if header.Size > s.cfg.MaxSize {
		return nil, models.ErrFileTooLarge
	}

	// Validate file type
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(header.Filename), "."))
	if !s.isAllowedFileType(ext) {
		return nil, models.ErrInvalidFileType
	}

	// Read file content
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Generate unique filename
	filename := fmt.Sprintf("%s_%d", strings.TrimSuffix(header.Filename, filepath.Ext(header.Filename)), uniqueTimestamp())

	// Upload parameters with optimization
	uploadParams := uploader.UploadParams{
		Folder:       s.folder,
		PublicID:     filename,
		ResourceType: "image",
		Transformation: "q_auto:eco,f_auto",
	}
	

	// Upload to Cloudinary
	ctx := context.Background()
	reader := bytes.NewReader(fileBytes)
	result, err := s.cld.Upload.Upload(ctx, reader, uploadParams)
	if err != nil {
		fmt.Println("Error 1:",err)
		return nil, fmt.Errorf("%w: %v", models.ErrUploadFailed, err)
	}

	// Return upload result
	return &UploadResult{
		URL:      result.SecureURL,
		PublicID: result.PublicID,
		Width:    result.Width,
		Height:   result.Height,
		Format:   result.Format,
		Size:     int64(result.Bytes),
	}, nil
}

// DeleteImage removes an image from Cloudinary by public ID
func (s *CloudinaryService) DeleteImage(publicID string) error {
	ctx := context.Background()
	_, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID:     publicID,
		ResourceType: "image",
	})

	if err != nil {
		return fmt.Errorf("failed to delete image: %w", err)
	}

	return nil
}

// isAllowedFileType checks if the file extension is in the allowed list
func (s *CloudinaryService) isAllowedFileType(ext string) bool {
	for _, allowed := range s.cfg.AllowedImageTypes {
		if ext == strings.ToLower(allowed) {
			return true
		}
	}
	return false
}

// uniqueTimestamp generates a unique timestamp for filenames
func uniqueTimestamp() int64 {
	return timeNow().UnixNano()
}

// timeNow is a helper function for testing purposes
var timeNow = func() time.Time {
	return time.Now()
}