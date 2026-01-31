package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"strings"
	"time"
)

// GenerateID generates a unique ID using timestamp and random bytes
func GenerateID(prefix string) string {
	timestamp := time.Now().UnixNano()
	randomBytes := make([]byte, 8)
	rand.Read(randomBytes)
	
	randomString := base64.URLEncoding.EncodeToString(randomBytes)
	randomString = strings.TrimRight(randomString, "=")
	
	return fmt.Sprintf("%s_%d_%s", prefix, timestamp, randomString)
}