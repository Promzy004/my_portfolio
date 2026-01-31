-- Portfolio Database Seeder
-- This file seeds the database with an initial admin user
-- Default password: Admin@123456 (CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN)

-- Insert default admin user
-- Password hash for 'Admin@123456' using bcrypt
INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
VALUES (
    'user_admin_001',
    'admin@portfolio.com',
    '$2a$10$rZJ5qY7qKxH9xKx6qxqx6qxqx6qxqx6qxqx6qxqx6qxqx6qxqx6qx',
    'Admin User',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE email=email;

-- Note: The password hash above is a placeholder
-- You should generate a real bcrypt hash for 'Admin@123456' or your chosen password
-- Use an online bcrypt generator or run: go run scripts/hash_password.go Admin@123456