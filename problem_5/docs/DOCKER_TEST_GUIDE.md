# Running Tests with Docker 🐳

## Quick Start

The easiest way to run tests is using Docker - everything is automated!

### Run All Tests

```bash
npm run test:docker
```

This single command will:

1. ✅ Start PostgreSQL container
2. ✅ Create test database automatically
3. ✅ Build test container
4. ✅ Run all tests
5. ✅ Show test results
6. ✅ Clean up containers

### Run Tests with Coverage

```bash
npm run test:docker:coverage
```

### Run Tests in Watch Mode

```bash
npm run test:docker:watch
```

**Note:** For watch mode, start the database first:

```bash
docker-compose --profile test up -d postgres
npm run test:docker:watch
```

## Manual Docker Commands

If you prefer more control:

### 1. Start Database

```bash
docker-compose --profile test up -d postgres
```

Wait for database to be ready (about 10-15 seconds).

### 2. Run Tests

```bash
docker-compose --profile test run --rm test npm test
```

### 3. Run Specific Test Command

```bash
# Coverage
docker-compose --profile test run --rm test npm run test:coverage

# Watch mode
docker-compose --profile test run --rm test npm run test:watch

# CI mode
docker-compose --profile test run --rm test npm run test:ci
```

### 4. Clean Up

```bash
docker-compose --profile test down
```

## How It Works

### Docker Setup

1. **PostgreSQL Container** (`postgres` service)
   - Runs PostgreSQL 16
   - Automatically creates test database on startup
   - Exposed on port 5432

2. **Test Container** (`test` service)
   - Built from `Dockerfile.test`
   - Contains Node.js, dependencies, and test files
   - Connects to PostgreSQL container
   - Runs Jest tests

### Test Database

- **Name:** `test_crud_db` (or `TEST_DB_NAME` from `.env`)
- **Created automatically** by `docker/postgres-init.sh`
- **Isolated** from your development database
- **Cleaned** after each test (TRUNCATE)

### Network

Both containers run on the same Docker network (`crud-network`), so they can communicate using service names:

- Test container connects to `postgres:5432`
- No need to expose ports for internal communication

## Environment Variables

You can customize the test setup with environment variables:

```bash
# .env or environment
DB_USER=postgres
DB_PASSWORD=postgres
TEST_DB_NAME=test_crud_db
```

Or pass them directly:

```bash
TEST_DB_NAME=my_test_db docker-compose --profile test run --rm test npm test
```

## Troubleshooting

### Tests can't connect to database

**Solution:** Make sure PostgreSQL container is running and healthy:

```bash
docker-compose --profile test up -d postgres
docker-compose --profile test ps
```

### Test container exits immediately

**Solution:** Check logs:

```bash
docker-compose --profile test logs test
```

### Database already exists error

**Solution:** This is normal - the init script checks if database exists before creating.

### Port already in use

**Solution:** Stop other PostgreSQL instances or change port in `.env`:

```bash
DB_PORT=5433 docker-compose --profile test up -d postgres
```

### Need to rebuild test container

```bash
docker-compose --profile test build --no-cache test
npm run test:docker
```

## Example Output

When you run `npm run test:docker`, you'll see:

```
Building test...
Starting crud-postgres ... done
Starting crud-test ... done
crud-test    | PASS src/models/ResourceModel.test.ts
crud-test    |   ResourceModel
crud-test    |     create
crud-test    |       ✓ should create a resource successfully (45ms)
crud-test    |       ✓ should use default status if not provided (32ms)
crud-test    |     ...
crud-test    |
crud-test    | Test Suites: 3 passed, 3 total
crud-test    | Tests:       27 passed, 27 total
crud-test exited with code 0
```

## Tips

1. **First time setup:** The first run will take longer as it builds the test container
2. **Subsequent runs:** Will be faster as Docker caches layers
3. **Watch mode:** Great for development - tests re-run automatically on file changes
4. **Coverage:** Use `test:docker:coverage` to see which code is tested
5. **CI/CD:** Use `test:docker` in your CI pipeline - it's self-contained!

## Comparison: Docker vs Local

| Feature      | Docker             | Local              |
| ------------ | ------------------ | ------------------ |
| Setup        | ✅ Automatic       | ❌ Manual          |
| Database     | ✅ Auto-created    | ❌ Manual setup    |
| Isolation    | ✅ Complete        | ⚠️ Shared          |
| Consistency  | ✅ Same everywhere | ⚠️ Depends on env  |
| Speed        | ⚠️ Slightly slower | ✅ Faster          |
| Dependencies | ✅ Included        | ❌ Need to install |

**Recommendation:** Use Docker for consistency and ease of setup! 🚀
