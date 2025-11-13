# How to Run Tests

## Prerequisites

Before running tests, make sure you have:

1. **Docker and Docker Compose installed** (for Docker option)
   - Docker (v20.10 or higher)
   - Docker Compose (v2.0 or higher)

2. **OR Local PostgreSQL** (for local option)
   - PostgreSQL (v14 or higher)

3. **Dependencies installed** (for local option)
   ```bash
   npm install
   ```

## Quick Start

### Option 1: Using Docker (Recommended) 🐳

This is the easiest way - everything runs in Docker containers!

#### Run Tests in Docker:

```bash
npm run test:docker
```

This will:

- Start PostgreSQL container
- Create test database automatically
- Build test container
- Run all tests
- Clean up containers after tests

#### Run Tests with Coverage in Docker:

```bash
npm run test:docker:coverage
```

#### Run Tests in Watch Mode (Docker):

```bash
npm run test:docker:watch
```

#### Manual Docker Commands:

**Start database only:**

```bash
docker-compose up -d postgres
```

**Run tests (database must be running):**

```bash
docker-compose --profile test run --rm test npm test
```

**Run specific test command:**

```bash
docker-compose --profile test run --rm test npm run test:coverage
```

**Clean up after tests:**

```bash
docker-compose --profile test down
```

### Option 2: Local Development

1. **Start the database with Docker:**

   ```bash
   docker-compose up -d postgres
   ```

   This will start PostgreSQL and automatically create the test database.

2. **Run tests locally:**
   ```bash
   npm test
   ```

### Option 3: Local PostgreSQL (No Docker)

1. **Make sure PostgreSQL is running locally**

2. **Create test database (if not exists):**

   ```bash
   createdb -U postgres test_crud_db
   ```

   Or the test database will be created automatically by the test setup.

3. **Run tests:**
   ```bash
   npm test
   ```

## Test Commands

### Docker Commands (Recommended)

#### Run All Tests in Docker

```bash
npm run test:docker
```

Runs all unit and integration tests in Docker containers. Database is automatically set up.

#### Run Tests with Coverage in Docker

```bash
npm run test:docker:coverage
```

Runs all tests with coverage report in Docker.

#### Run Tests in Watch Mode (Docker)

```bash
npm run test:docker:watch
```

Runs tests in watch mode in Docker - automatically re-runs tests when files change.

### Local Commands

#### Run All Tests

```bash
npm test
```

Runs all unit and integration tests (requires database to be running).

#### Run Tests in Watch Mode

```bash
npm run test:watch
```

Runs tests in watch mode - automatically re-runs tests when files change. Great for development!

#### Run Tests with Coverage Report

```bash
npm run test:coverage
```

Runs all tests and generates a coverage report showing:

- Which files are tested
- Line coverage percentage
- Statement coverage
- Function coverage
- Branch coverage

After running, view the HTML report:

```bash
open coverage/lcov-report/index.html
```

#### Run Tests in CI Mode

```bash
npm run test:ci
```

Runs tests optimized for CI/CD pipelines with coverage.

## Test Environment Configuration

Tests use a **separate test database** to avoid affecting your development data.

### Default Test Database Settings:

- **Database Name:** `test_crud_db`
- **Host:** `localhost`
- **Port:** `5432`
- **User:** `postgres`
- **Password:** `postgres`

### Custom Test Database Configuration

Create a `.env.test` file in the project root to override defaults:

```env
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=test_crud_db
TEST_DB_USER=postgres
TEST_DB_PASSWORD=postgres
```

## What Happens During Tests

1. **Before All Tests (`beforeAll`):**
   - Test database is created (if it doesn't exist)
   - Database schema is initialized (tables, indexes)

2. **Each Test:**
   - Creates real data in the database
   - Performs actual database operations
   - Verifies results

3. **After Each Test (`afterEach`):**
   - All data is automatically cleaned up using `TRUNCATE`
   - Database is reset to a clean state

4. **After All Tests (`afterAll`):**
   - Database connection is closed

## Test Structure

```
Tests are organized as:
├── src/
│   ├── models/
│   │   └── ResourceModel.test.ts      # Unit tests for data access layer
│   └── services/
│       └── ResourceService.test.ts    # Unit tests for business logic
└── tests/
    └── integration/
        └── resources.test.ts          # Integration tests for API endpoints
```

## Troubleshooting

### Error: "Cannot connect to database"

- Make sure PostgreSQL is running
- Check database connection settings
- Verify database credentials

### Error: "Database does not exist"

- The test database will be created automatically
- If it fails, create manually: `createdb -U postgres test_crud_db`

### Error: "Permission denied"

- Make sure the database user has proper permissions
- Check PostgreSQL user credentials

### Tests are slow

- This is normal - tests use real database operations
- Consider using `test:watch` for faster feedback during development

## Example Output

When you run `npm test`, you'll see:

```
PASS  src/models/ResourceModel.test.ts
  ResourceModel
    create
      ✓ should create a resource successfully (45ms)
      ✓ should use default status if not provided (32ms)
    findById
      ✓ should return a resource by id (28ms)
      ✓ should return null if resource does not exist (15ms)
    ...

PASS  src/services/ResourceService.test.ts
  ResourceService
    create
      ✓ should create a resource successfully (38ms)
      ✓ should throw ValidationError if name is missing (12ms)
    ...

PASS  tests/integration/resources.test.ts
  Resources API Integration Tests
    POST /api/resources
      ✓ should create a new resource (156ms)
    ...

Test Suites: 3 passed, 3 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        3.456 s
```

## Tips

1. **Use watch mode during development:**

   ```bash
   npm run test:watch
   ```

   Tests will automatically re-run when you save files.

2. **Check coverage regularly:**

   ```bash
   npm run test:coverage
   ```

   Aim for high coverage to ensure code quality.

3. **Run specific test files:**

   ```bash
   npm test -- ResourceModel.test.ts
   ```

4. **Run tests matching a pattern:**
   ```bash
   npm test -- --testNamePattern="create"
   ```
