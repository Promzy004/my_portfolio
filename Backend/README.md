# Portfolio Backend - Go API

A professional RESTful API built with Go, Chi router, MySQL, JWT authentication, and Cloudinary integration for portfolio management.

## Features

- **JWT Authentication** with access and refresh tokens
- **Role-based Access Control** (Admin only)
- **Rate Limiting** on login endpoint (5 attempts per 15 minutes)
- **Image Upload** with Cloudinary optimization (< 150KB)
- **Pagination** support (15 items per page)
- **CORS** configuration for frontend integration
- **Input Validation** using go-playground/validator
- **Standardized JSON responses**
- **Professional error handling**
- **Database connection pooling**

## Tech Stack

- **Go 1.21+**
- **Chi Router** - Lightweight HTTP router
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting and optimization
- **Validator** - Input validation

## Project Structure

```
portfolio-backend/
├── config/
│   ├── config.go          # Environment configuration
│   └── db.go              # Database connection setup
├── internal/
│   ├── handlers/          # HTTP request handlers
│   │   ├── authHandler.go
│   │   ├── blogHandler.go
│   │   ├── projectHandler.go
│   │   ├── skillHandler.go
│   │   ├── socialHandler.go
│   │   ├── experienceHandler.go
│   │   └── uploadHandler.go
│   ├── middlewares/       # HTTP middlewares
│   │   ├── authMiddleware.go
│   │   ├── corsMiddleware.go
│   │   └── rateLimitMiddleware.go
│   ├── models/            # Data models
│   │   ├── user.go
│   │   ├── blog.go
│   │   ├── project.go
│   │   ├── skill.go
│   │   ├── social.go
│   │   ├── experience.go
│   │   └── errors.go
│   ├── repositories/      # Database operations
│   │   ├── userRepository.go
│   │   ├── blogRepository.go
│   │   ├── projectRepository.go
│   │   ├── skillRepository.go
│   │   ├── socialRepository.go
│   │   └── experienceRepository.go
│   ├── services/          # Business logic
│   │   ├── authService.go
│   │   ├── blogService.go
│   │   ├── projectService.go
│   │   ├── skillService.go
│   │   ├── socialService.go
│   │   ├── experienceService.go
│   │   └── cloudinaryService.go
│   └── utils/             # Utility functions
│       ├── jwt.go
│       ├── password.go
│       ├── validator.go
│       ├── response.go
│       └── id.go
├── routes/
│   └── api.go             # All API routes
├── migrations/
│   ├── 001_create_tables.sql
│   └── 002_seed_admin.sql
├── .env.example           # Environment variables template
├── .gitignore
├── go.mod
├── go.sum
├── main.go                # Application entry point
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Go 1.21 or higher
- MySQL 8.0 or higher
- Cloudinary account

### 2. Clone and Install Dependencies

```bash
# Navigate to backend directory
cd portfolio-backend

# Install dependencies
go mod download
```

### 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations:

```bash
# Run the migration file
mysql -u root -p portfolio_db < migrations/001_create_tables.sql

# Run the seeder (creates default admin)
mysql -u root -p portfolio_db < migrations/002_seed_admin.sql
```

### 4. Environment Configuration

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=8080
ENVIRONMENT=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db

# JWT (Generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=720h

# CORS (Add your frontend URL)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=portfolio

# Rate Limiting
LOGIN_RATE_LIMIT=5
LOGIN_RATE_WINDOW=15m

# File Upload
MAX_UPLOAD_SIZE=2097152
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp,svg
```

### 5. Generate Admin Password Hash

You need to generate a bcrypt hash for your admin password. Create a helper script:

```bash
# Create scripts directory
mkdir scripts

# Create hash generator
cat > scripts/hash_password.go << 'EOF'
package main

import (
	"fmt"
	"os"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run hash_password.go <password>")
		os.Exit(1)
	}
	
	password := os.Args[1]
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}
	
	fmt.Printf("Bcrypt hash for '%s':\n%s\n", password, string(hash))
}
EOF

# Generate hash
go run scripts/hash_password.go "Admin@123456"
```

Update the hash in `migrations/002_seed_admin.sql` and re-run the seeder.

### 6. Run the Server

```bash
# Development mode
go run main.go

# Or build and run
go build -o portfolio-api
./portfolio-api
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/setup` | Create initial admin (one-time only) | No |
| POST | `/api/auth/login` | Login with email and password | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout and invalidate refresh token | Yes |

### Blogs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blogs` | Get all blogs (paginated) | No |
| GET | `/api/blogs/{id}` | Get single blog | No |
| POST | `/api/blogs` | Create new blog | Yes |
| PUT | `/api/blogs/{id}` | Update blog | Yes |
| DELETE | `/api/blogs/{id}` | Delete blog | Yes |

### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects (paginated) | No |
| GET | `/api/projects/{id}` | Get single project | No |
| POST | `/api/projects` | Create new project | Yes |
| PUT | `/api/projects/{id}` | Update project | Yes |
| DELETE | `/api/projects/{id}` | Delete project | Yes |

### Skills

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/skills` | Get all skills | No |
| GET | `/api/skills/{id}` | Get single skill | No |
| POST | `/api/skills` | Create new skill | Yes |
| PUT | `/api/skills/{id}` | Update skill | Yes |
| DELETE | `/api/skills/{id}` | Delete skill | Yes |

### Socials

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/socials` | Get all social links | No |
| GET | `/api/socials/{id}` | Get single social link | No |
| POST | `/api/socials` | Create new social link | Yes |
| PUT | `/api/socials/{id}` | Update social link | Yes |
| DELETE | `/api/socials/{id}` | Delete social link | Yes |

### Experiences

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/experiences` | Get all experiences | No |
| GET | `/api/experiences/{id}` | Get single experience | No |
| POST | `/api/experiences` | Create new experience | Yes |
| PUT | `/api/experiences/{id}` | Update experience | Yes |
| DELETE | `/api/experiences/{id}` | Delete experience | Yes |

### File Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload/image` | Upload image to Cloudinary | Yes |

## Request/Response Examples

### Login

**Request:**
```json
POST /api/auth/login
{
  "email": "admin@portfolio.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_admin_001",
      "email": "admin@portfolio.com",
      "name": "Admin User"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 1800
  }
}
```

### Create Blog

**Request:**
```json
POST /api/blogs
Authorization: Bearer <access_token>

{
  "title": "My First Blog Post",
  "excerpt": "This is a brief description of my blog post",
  "date": "2026-01-29",
  "slug": "my-first-blog-post",
  "blocks": [
    {
      "id": "b1",
      "type": "paragraph",
      "data": {
        "text": "This is the first paragraph"
      }
    },
    {
      "id": "b2",
      "type": "heading",
      "data": {
        "level": 2,
        "text": "Introduction"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "blog_1738184400_abc123",
    "title": "My First Blog Post",
    ...
  }
}
```

### Upload Image

**Request:**
```
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/portfolio/image.jpg",
    "public_id": "portfolio/image",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "size": 145234
  }
}
```

## Free Hosting Recommendations

### Option 1: Railway (Recommended)
- **Frontend**: Railway
- **Backend**: Railway  
- **Database**: Railway MySQL (free tier: 512MB)
- **Free Tier**: $5 credit/month (enough for small apps)
- **Setup**: Connect GitHub repo, auto-deploy on push

### Option 2: Render
- **Frontend**: Render Static Site
- **Backend**: Render Web Service
- **Database**: PlanetScale (MySQL compatible, generous free tier)
- **Free Tier**: 750 hours/month web service
- **Hibernates after 15 min inactivity**

### Option 3: Fly.io + PlanetScale
- **Frontend**: Vercel/Netlify
- **Backend**: Fly.io (3 VMs free)
- **Database**: PlanetScale (10GB free)
- **Best for**: Separation of concerns

## Development

### Run Tests

```bash
go test ./...
```

### Build for Production

```bash
# Build binary
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o portfolio-api .

# Run
./portfolio-api
```

## Security Considerations

1. **Change Default Admin Password** immediately after first login
2. **Use Strong JWT Secret** (generate with `openssl rand -base64 64`)
3. **Enable HTTPS** in production
4. **Set Secure Cookie Flags** for refresh tokens
5. **Implement Rate Limiting** on all endpoints (currently only on login)
6. **Sanitize SVG Icons** on the frontend to prevent XSS
7. **Validate File Types** strictly on upload
8. **Use Environment Variables** for all secrets
9. **Enable CORS** only for trusted domains
10. **Keep Dependencies Updated** regularly

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify credentials
mysql -u your_user -p portfolio_db -e "SHOW TABLES"
```

### Cloudinary Upload Fails
- Verify API credentials in `.env`
- Check file size (must be < 2MB)
- Ensure allowed file type (jpg, png, webp, svg)

### JWT Token Invalid
- Ensure JWT_SECRET is the same across restarts
- Check token expiry times
- Verify Authorization header format: `Bearer <token>`

### Rate Limit Blocking
- Wait 15 minutes
- Or clear login_attempts table: `TRUNCATE TABLE login_attempts;`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.