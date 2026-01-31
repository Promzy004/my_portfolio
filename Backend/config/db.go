package config

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// SetupDatabase establishes a connection to the MySQL database with connection pooling
func SetupDatabase(cfg DatabaseConfig) (*sql.DB, error) {
	// Build DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.DBName,
	)

	// Open database connection
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)                  // Maximum number of open connections
	db.SetMaxIdleConns(5)                   // Maximum number of idle connections
	db.SetConnMaxLifetime(5 * time.Minute)  // Maximum lifetime of a connection
	db.SetConnMaxIdleTime(10 * time.Minute) // Maximum idle time of a connection

	// Verify connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}