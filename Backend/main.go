package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	// Serve frontend static files + React Router fallback
	r.HandleFunc("/*", func(w http.ResponseWriter, r *http.Request) {
		distDir := "./dist"
		path := filepath.Join(distDir, r.URL.Path)

		// Serve index.html for React routes if file doesn't exist
		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
			return
		}

		// Otherwise serve the static file
		http.FileServer(http.Dir(distDir)).ServeHTTP(w, r)
	})

	fmt.Printf("Server running on [http://127.0.0.1:8000]")
	log.Fatal(http.ListenAndServe(":8000", r))
}