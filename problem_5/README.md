# CRUD Server - ExpressJS with TypeScript

A production-ready backend server built with ExpressJS and TypeScript, implementing full CRUD operations with proper error handling, validation, and database persistence.

## Requirements Fulfilled

This project fulfills all the basic requirements:

✅ **ExpressJS Backend** - Built with Express.js framework  
✅ **TypeScript** - Full TypeScript implementation with strict type checking  
✅ **CRUD Operations** - Complete Create, Read, Update, Delete interfaces  
✅ **Resource Listing** - List resources with basic filters (status, search)  
✅ **Resource Details** - Get individual resource by ID  
✅ **Database Persistence** - PostgreSQL database with Docker support  
✅ **README Documentation** - Comprehensive setup and usage guide

📊 **See detailed requirements comparison:** [Requirements Comparison](./docs/REQUIREMENTS_COMPARISON.md) - 100% match with extensive improvements

## Additional Features & Improvements

Beyond the basic requirements, this implementation includes several production-ready enhancements:

### 🚀 Enhanced Functionality

- **Advanced Filtering**: Filter by status, search by name/description, with pagination support
- **Input Validation**: Comprehensive validation using express-validator with detailed error messages
- **Error Handling**: Centralized error handling with custom error classes and consistent error responses
- **API Authentication**: API key-based authentication for securing endpoints
- **API Documentation**: Interactive Swagger/OpenAPI documentation with testing interface (like Postman)

### 🏗️ Architecture & Code Quality

- **Clean Architecture**: Separation of concerns (Controllers → Services → Models)
- **Type Safety**: Full TypeScript with strict type checking and no unused variables
- **Testing**: Comprehensive unit and integration tests with Jest and Supertest
- **Code Organization**: Well-structured project with clear separation of concerns

### 🔒 Security & Production Readiness

- **Security Headers**: Helmet.js for security headers
- **CORS Support**: Configurable CORS for cross-origin requests
- **Environment Configuration**: Secure environment variable management with .env.example
- **Docker Support**: Complete Docker setup with docker-compose for easy deployment

### 📚 Developer Experience

- **Interactive API Testing**: Swagger UI for testing endpoints directly in the browser
- **Test Coverage**: Unit tests for services/models, integration tests for API endpoints
- **Documentation**: Detailed README with examples, troubleshooting, and API documentation

## Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete resources
- ✅ **Advanced Filtering**: Filter resources by status, search by name/description
- ✅ **Pagination**: Built-in pagination support for listing resources
- ✅ **Input Validation**: Comprehensive validation using express-validator
- ✅ **Error Handling**: Centralized error handling with custom error classes
- ✅ **Type Safety**: Full TypeScript support with strict type checking
- ✅ **Database**: PostgreSQL database with Docker support
- ✅ **Docker**: Complete Docker setup with docker-compose
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation with testing interface
- ✅ **Testing**: Comprehensive unit and integration tests with Jest
- ✅ **Security**: Helmet.js for security headers, CORS support
- ✅ **Clean Architecture**: Separation of concerns (Controllers, Services, Models)

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI with Swagger UI
- **Testing**: Jest, Supertest
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Prerequisites

### Option 1: Using Docker (Recommended)

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

### Option 2: Local Development

- Node.js (v18 or higher recommended)
- PostgreSQL (v14 or higher)
- npm or yarn

## Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker Compose:

1. **Clone the repository and navigate to the project directory:**

```bash
cd problem_5
```

2. **Create a `.env` file from the example:**

```bash
cp .env.example .env
```

Then edit `.env` and set your values, especially:

- `API_KEY`: Generate a strong, random API key for production
- Database credentials: Match your PostgreSQL setup

**Important**:

- Set a strong `API_KEY` for production use (e.g., `openssl rand -hex 32`)
- If `API_KEY` is not set, the API will run without authentication (development mode only)
- Never commit your `.env` file to version control

3. **Start the application with Docker Compose:**

```bash
docker-compose up --build
```

This will:

- Build the Node.js application
- Start PostgreSQL database
- Initialize the database schema
- Start the API server on `http://localhost:3000`
- Access API documentation at `http://localhost:3000/api-docs`

4. **To run in detached mode:**

```bash
docker-compose up -d --build
```

5. **To stop the application:**

```bash
docker-compose down
```

6. **To stop and remove volumes (clean database):**

```bash
docker-compose down -v
```

7. **View logs:**

```bash
docker-compose logs -f app
```

## Local Development Setup

If you prefer to run locally without Docker:

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and update with your PostgreSQL credentials:
   - `DB_USER`: Your PostgreSQL username
   - `DB_PASSWORD`: Your PostgreSQL password
   - `DB_NAME`: Your database name (or create a new one)
   - `API_KEY`: Generate a strong API key (e.g., `openssl rand -hex 32`)

3. **Run the application:**

```bash
# Development mode with hot-reload
npm run dev

# Or build and run in production mode
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation (Swagger)

The API includes interactive Swagger documentation that allows you to test all endpoints directly from your browser, similar to Postman.

### Access Swagger UI

Once the server is running, navigate to:

```
http://localhost:3000/api-docs
```

### Features

- **Interactive Testing**: Test all API endpoints directly from the browser
- **Request/Response Examples**: See example requests and responses for each endpoint
- **Schema Documentation**: View detailed schemas for all request/response models
- **Try It Out**: Execute API calls and see real responses
- **OpenAPI 3.0**: Standard OpenAPI specification for integration with other tools

### Using Swagger UI

1. **Navigate to `/api-docs`** in your browser
2. **Expand any endpoint** to see its details
3. **Click "Try it out"** to enable testing
4. **Fill in parameters** (path, query, or request body)
5. **Click "Execute"** to send the request
6. **View the response** with status code, headers, and body

The Swagger UI provides a complete Postman-like experience without needing external tools!

## Authentication

The API uses API key authentication to secure all endpoints (except the health check endpoint).

### API Key Configuration

Set your API key in the `.env` file:

```bash
API_KEY=your-secret-api-key-here
```

**Security Note**:

- Always use a strong, randomly generated API key in production
- Never commit your API key to version control
- If `API_KEY` is not set, the API will run without authentication (development only)

### Using the API Key

You can provide the API key in two ways:

#### 1. HTTP Header (Recommended)

```bash
curl -H "X-API-Key: your-secret-api-key-here" \
  http://localhost:3000/api/resources
```

#### 2. Query Parameter

```bash
curl "http://localhost:3000/api/resources?apiKey=your-secret-api-key-here"
```

### Swagger UI

When using Swagger UI (`/api-docs`):

1. Click the **"Authorize"** button at the top
2. Enter your API key in the `X-API-Key` field
3. Click **"Authorize"**
4. All requests will now include your API key

### Error Responses

- **401 Unauthorized**: Missing or invalid API key
  ```json
  {
    "success": false,
    "error": {
      "message": "API key is required. Please provide it in the X-API-Key header or apiKey query parameter.",
      "statusCode": 401
    }
  }
  ```

## API Endpoints

### Base URL

```
http://localhost:3000/api/resources
```

### Health Check

```
GET /health
```

### 1. Create a Resource

```
POST /api/resources
Content-Type: application/json

{
  "name": "Resource Name",
  "description": "Resource description",
  "status": "active" // optional, defaults to "active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Resource Name",
    "description": "Resource description",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. List Resources (with filters)

```
GET /api/resources?status=active&search=keyword&page=1&limit=10
```

**Query Parameters:**

- `status` (optional): Filter by status (`active` or `inactive`)
- `search` (optional): Search in name and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Resource Name",
      "description": "Resource description",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Get Resource by ID

```
GET /api/resources/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Resource Name",
    "description": "Resource description",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Resource

```
PUT /api/resources/:id
Content-Type: application/json

{
  "name": "Updated Name", // optional
  "description": "Updated description", // optional
  "status": "inactive" // optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Name",
    "description": "Updated description",
    "status": "inactive",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### 5. Delete Resource

```
DELETE /api/resources/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400
  }
}
```

**Common Status Codes:**

- `400`: Bad Request (Validation errors)
- `404`: Not Found (Resource not found)
- `500`: Internal Server Error

## Project Structure

```
problem_5/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database configuration and initialization
│   │   └── swagger.ts           # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── ResourceController.ts # Request handlers
│   ├── middleware/
│   │   ├── auth.ts              # API key authentication middleware
│   │   ├── errorHandler.ts      # Global error handler
│   │   └── validation.ts        # Input validation middleware
│   ├── models/
│   │   └── ResourceModel.ts     # Database operations
│   ├── routes/
│   │   └── resourceRoutes.ts    # Route definitions
│   ├── services/
│   │   └── ResourceService.ts   # Business logic
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── errors.ts            # Custom error classes
│   └── index.ts                 # Application entry point
├── tests/
│   ├── helpers/
│   │   ├── auth.ts              # Test authentication helpers
│   │   └── database.ts          # Database test helpers
│   ├── integration/
│   │   └── resources.test.ts    # API integration tests
│   ├── unit/
│   │   ├── models/
│   │   │   └── ResourceModel.test.ts
│   │   └── services/
│   │       └── ResourceService.test.ts
│   └── setup.ts                 # Test configuration
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker image definition
├── .dockerignore                 # Docker ignore file
├── .env.example                  # Example environment variables file
├── .gitignore
├── jest.config.js                # Jest test configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

The `resources` table has the following structure:

```sql
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Indexes are created on `status` and `name` columns for better query performance.

## Docker Commands

### Build and Start

```bash
docker-compose up --build
```

### Start in Background

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### Access PostgreSQL Container

```bash
docker-compose exec postgres psql -U postgres -d crud_db
```

## Development

### Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server
- `npm run clean`: Remove compiled files
- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:ci`: Run tests in CI mode with coverage
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting without making changes
- `npm run lint`: Check code formatting (alias for format:check)

### Code Quality

The project uses strict TypeScript configuration with:

- Strict type checking
- No unused variables/parameters
- Consistent code style
- Source maps for debugging

### Code Formatting

The project uses **Prettier** for consistent code formatting:

```bash
# Format all code
npm run format

# Check formatting without making changes
npm run format:check
```

**Pre-commit Hooks**: The project uses **Husky** and **lint-staged** to automatically:

- Format staged files with Prettier (only files you're committing)
- Build the project to check for TypeScript errors
- Run tests

These checks run automatically before each commit. If any check fails, the commit will be blocked.

**To set up Husky** (run once after cloning):

```bash
npm install
# Husky will be initialized automatically via the "prepare" script
```

**Note**: The pre-commit hook will:

1. Format only the files you're committing (using lint-staged for efficiency)
2. Build the entire project to catch any TypeScript errors
3. Run all tests to ensure nothing is broken

If you need to skip the pre-commit hook (not recommended):

```bash
git commit --no-verify
```

## 🚀 Production Deployment

This application is production-ready and can be deployed using Docker, container orchestration, or traditional server setups.

### Quick Start

For detailed production deployment instructions, see **[PRODUCTION_DEPLOYMENT.md](./docs/PRODUCTION_DEPLOYMENT.md)**.

### Quick Deploy with Docker Compose

```bash
# 1. Configure production environment
cp .env.example .env
# Edit .env with production values (strong passwords, API keys, etc.)

# 2. Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Verify deployment
curl http://localhost:3000/health
```

### Deployment Options

The production deployment guide covers:

- ✅ **Docker Compose Deployment** - Recommended for single-server deployments
- ✅ **Docker Standalone** - For container orchestration (Kubernetes, etc.)
- ✅ **Manual Deployment** - Traditional server setup with PM2
- ✅ **Environment Configuration** - Secure environment variable management
- ✅ **Database Setup** - Production database configuration and initialization
- ✅ **Security Best Practices** - Firewall, SSL/TLS, API keys, and more
- ✅ **Monitoring & Health Checks** - Application monitoring and health endpoints
- ✅ **Scaling & Performance** - Horizontal scaling and performance optimization
- ✅ **Backup & Recovery** - Automated backups and disaster recovery
- ✅ **Troubleshooting** - Common issues and solutions

### Production Checklist

Before deploying to production:

- [ ] All tests pass: `npm test`
- [ ] Environment variables configured securely
- [ ] Strong API keys and database passwords set
- [ ] SSL/TLS certificates configured (if using HTTPS)
- [ ] Firewall rules configured
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Health checks verified

### Key Production Files

- **`docs/PRODUCTION_DEPLOYMENT.md`** - Complete deployment guide
- **`docker-compose.prod.yml`** - Production Docker Compose configuration
- **`backup.sh`** - Automated database backup script
- **`Dockerfile`** - Production-optimized Docker image

### Security Considerations

- 🔒 Use strong, randomly generated API keys
- 🔒 Never commit `.env` files to version control
- 🔒 Use HTTPS in production (configure reverse proxy)
- 🔒 Restrict database access (firewall rules)
- 🔒 Keep dependencies updated
- 🔒 Enable security headers (Helmet.js is already configured)

For complete production deployment instructions, troubleshooting, and best practices, see **[PRODUCTION_DEPLOYMENT.md](./docs/PRODUCTION_DEPLOYMENT.md)**.

## Testing

The project includes comprehensive unit and integration tests using Jest and Supertest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Structure

```
tests/
├── setup.ts                    # Test configuration and setup
├── helpers/
│   └── database.ts             # Database helper functions for tests
├── unit/
│   ├── services/
│   │   └── ResourceService.test.ts
│   └── models/
│       └── ResourceModel.test.ts
└── integration/
    └── resources.test.ts       # API endpoint integration tests
```

### Test Coverage

The test suite includes:

- **Unit Tests**:
  - Service layer validation and business logic
  - Model layer database operations
  - Error handling

- **Integration Tests**:
  - Full CRUD operations
  - Request/response validation
  - Error scenarios
  - Filtering and pagination
  - Health check endpoint

### Test Database Setup

Tests use a separate test database (`test_crud_db`).

**When using Docker:**

- The test database is automatically created when PostgreSQL container starts
- No additional configuration needed

**For local testing (without Docker):**

- Create the test database manually:
  ```bash
  createdb -U postgres test_crud_db
  ```
- Or configure in `.env.test`:
  ```bash
  TEST_DB_HOST=localhost
  TEST_DB_PORT=5432
  TEST_DB_NAME=test_crud_db
  TEST_DB_USER=postgres
  TEST_DB_PASSWORD=postgres
  ```

The test database is automatically set up and cleaned between tests.

### Coverage Reports

After running `npm run test:coverage`, you can view the coverage report:

- HTML report: `coverage/index.html`
- LCOV report: `coverage/lcov.info`

## Testing the API

You can test the API using tools like:

- **cURL**
- **Postman**
- **Thunder Client** (VS Code extension)
- **HTTPie**

### Example cURL Commands

**Note**: Replace `your-api-key` with your actual API key.

```bash
# Create a resource
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"name":"Test Resource","description":"This is a test"}'

# List all resources
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/resources

# Get resource by ID
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/resources/1

# Update resource
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"status":"inactive"}'

# Delete resource
curl -X DELETE \
  -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/resources/1
```

## Environment Variables

| Variable      | Description                          | Default                               |
| ------------- | ------------------------------------ | ------------------------------------- |
| `PORT`        | Server port                          | `3000`                                |
| `NODE_ENV`    | Environment (development/production) | `development`                         |
| `DB_HOST`     | PostgreSQL host                      | `localhost` (or `postgres` in Docker) |
| `DB_PORT`     | PostgreSQL port                      | `5432`                                |
| `DB_NAME`     | Database name                        | `crud_db`                             |
| `DB_USER`     | Database user                        | `postgres`                            |
| `DB_PASSWORD` | Database password                    | `postgres`                            |
| `API_KEY`     | API key for authentication           | (required for production)             |

## Troubleshooting

### Docker Issues

**Port already in use:**

```bash
# Change PORT in .env file or docker-compose.yml
```

**Database connection errors:**

- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database credentials in `.env`
- Wait for database to be ready (healthcheck should pass)

**Rebuild after dependency changes:**

```bash
docker-compose build --no-cache
docker-compose up
```

### Local Development Issues

**PostgreSQL connection errors:**

- Ensure PostgreSQL is running
- Verify database credentials
- Check if database exists: `psql -U postgres -l`

**TypeScript compilation errors:**

- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration

## Project Summary

### Core Requirements ✅

- [x] ExpressJS backend server
- [x] TypeScript implementation
- [x] CRUD operations (Create, Read, Update, Delete)
- [x] List resources with basic filters
- [x] Get resource details
- [x] Update resource details
- [x] Delete resource
- [x] Database persistence (PostgreSQL)
- [x] README.md with configuration and run instructions

### Enhancements Beyond Requirements 🚀

- [x] Advanced filtering (status, search, pagination)
- [x] Input validation with express-validator
- [x] Comprehensive error handling
- [x] API key authentication
- [x] Swagger/OpenAPI interactive documentation
- [x] Unit and integration tests (Jest + Supertest)
- [x] Docker and docker-compose setup
- [x] Clean architecture (MVC pattern)
- [x] Security middleware (Helmet, CORS)
- [x] Environment configuration management
- [x] Production-ready error responses
- [x] Type-safe codebase with strict TypeScript
- [x] Code formatting with Prettier
- [x] Pre-commit hooks with Husky (format, build, test)

## Documentation

This project includes comprehensive documentation in the `docs/` folder:

### 📚 Available Documentation

- **[Requirements Comparison](./docs/REQUIREMENTS_COMPARISON.md)** - Requirements match analysis and improvements overview
- **[Production Deployment](./docs/PRODUCTION_DEPLOYMENT.md)** - Complete guide for deploying to production
- **[How to Run Tests](./docs/HOW_TO_RUN_TESTS.md)** - Detailed testing instructions
- **[Docker Test Guide](./docs/DOCKER_TEST_GUIDE.md)** - Running tests with Docker
- **[Scripts Documentation](./docs/SCRIPTS_DOCUMENTATION.md)** - Complete guide to all npm scripts
- **[Unit Test Review](./docs/UNIT_TEST_REVIEW.md)** - Detailed review of all unit tests
- **[Husky Troubleshooting](./docs/HUSKY_TROUBLESHOOTING.md)** - Troubleshooting pre-commit hooks

### Quick Links

- **Getting Started**: See [Quick Start with Docker](#quick-start-with-docker-recommended) above
- **Testing**: See [Testing](#testing) section
- **Deployment**: See [Production Deployment](#-production-deployment) section
- **API Documentation**: Access Swagger UI at `http://localhost:3000/api-docs` when server is running

## License

ISC
