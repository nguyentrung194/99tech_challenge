# Package.json Scripts Documentation

This document provides detailed information about all npm scripts available in this project.

## Table of Contents

- [Build & Development Scripts](#build--development-scripts)
- [Test Scripts](#test-scripts)
- [Docker Test Scripts](#docker-test-scripts)
- [Code Quality Scripts](#code-quality-scripts)
- [Utility Scripts](#utility-scripts)

---

## Build & Development Scripts

### `npm run build`

**Purpose:** Compiles TypeScript source code to JavaScript.

**Command:** `tsc`

**What it does:**

- Compiles all TypeScript files in `src/` directory
- Outputs JavaScript files to `dist/` directory
- Generates type declaration files (`.d.ts`)
- Creates source maps for debugging

**When to use:**

- Before deploying to production
- To check for TypeScript compilation errors
- Before running production server

**Example:**

```bash
npm run build
```

**Output:**

- `dist/` directory with compiled JavaScript files

---

### `npm start`

**Purpose:** Starts the production server.

**Command:** `node dist/index.js`

**What it does:**

- Runs the compiled JavaScript from `dist/index.js`
- Starts the Express server on the configured port (default: 3000)
- Uses production environment settings

**Prerequisites:**

- Must run `npm run build` first
- Database must be running and accessible

**When to use:**

- Running the application in production
- Testing the production build locally

**Example:**

```bash
npm run build
npm start
```

**Environment Variables:**

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Should be set to `production`
- Database connection variables (DB_HOST, DB_PORT, etc.)

---

### `npm run dev`

**Purpose:** Starts the development server with hot-reload.

**Command:** `ts-node-dev --respawn --transpile-only src/index.ts`

**What it does:**

- Runs TypeScript directly without compilation
- Automatically restarts server when files change
- Fast transpilation (no type checking for speed)
- Watches for file changes in `src/` directory

**When to use:**

- During active development
- When you want automatic server restarts on code changes
- For faster development iteration

**Example:**

```bash
npm run dev
```

**Features:**

- ✅ Hot reload - server restarts on file changes
- ✅ Fast - no full TypeScript compilation
- ✅ Development-friendly error messages

**Note:** Type checking is disabled for speed. Run `npm run build` to check types.

---

### `npm run clean`

**Purpose:** Removes compiled files and build artifacts.

**Command:** `rm -rf dist`

**What it does:**

- Deletes the entire `dist/` directory
- Removes all compiled JavaScript files
- Removes type declaration files
- Removes source maps

**When to use:**

- Before a fresh build
- To clean up old build artifacts
- When switching branches with different build outputs

**Example:**

```bash
npm run clean
npm run build
```

---

## Test Scripts

### `npm test`

**Purpose:** Runs all unit and integration tests.

**Command:** `jest`

**What it does:**

- Runs all test files matching `**/*.test.ts` and `**/*.spec.ts`
- Executes tests serially (one at a time) to avoid database conflicts
- Uses test database configuration
- Shows test results and summary

**Prerequisites:**

- Database must be running (PostgreSQL)
- Test database will be created automatically

**When to use:**

- Before committing code
- To verify code changes
- In CI/CD pipelines

**Example:**

```bash
npm test
```

**Test Files:**

- `src/models/ResourceModel.test.ts`
- `src/services/ResourceService.test.ts`
- `tests/integration/resources.test.ts`

**Output:**

- Test results with pass/fail status
- Test execution time
- Number of tests passed/failed

---

### `npm run test:watch`

**Purpose:** Runs tests in watch mode with automatic re-execution.

**Command:** `jest --watch`

**What it does:**

- Runs tests initially
- Watches for file changes
- Automatically re-runs relevant tests when files change
- Interactive mode with options to filter tests

**When to use:**

- During active test development
- When writing new tests
- For test-driven development (TDD)

**Example:**

```bash
npm run test:watch
```

**Interactive Options:**

- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern
- Press `q` to quit watch mode

---

### `npm run test:coverage`

**Purpose:** Runs tests and generates coverage report.

**Command:** `jest --coverage`

**What it does:**

- Runs all tests
- Collects code coverage metrics
- Generates coverage reports in multiple formats
- Shows which code is tested and which isn't

**When to use:**

- To check test coverage
- Before submitting code for review
- To identify untested code

**Example:**

```bash
npm run test:coverage
```

**Coverage Metrics:**

- **Statements:** Percentage of code statements executed
- **Branches:** Percentage of code branches (if/else) tested
- **Functions:** Percentage of functions called
- **Lines:** Percentage of lines executed

**Output:**

- Console summary with coverage percentages
- HTML report: `coverage/lcov-report/index.html`
- LCOV report: `coverage/lcov.info`

**View HTML Report:**

```bash
open coverage/lcov-report/index.html
```

---

### `npm run test:ci`

**Purpose:** Runs tests optimized for CI/CD pipelines.

**Command:** `jest --ci --coverage --maxWorkers=2`

**What it does:**

- Runs tests in CI mode (non-interactive)
- Generates coverage report
- Uses 2 worker processes (faster than serial, but safe)
- Fails if tests fail (exit code 1)

**When to use:**

- In CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
- For automated testing
- When you need consistent, reproducible test runs

**Example:**

```bash
npm run test:ci
```

**CI Mode Features:**

- ✅ Non-interactive (no prompts)
- ✅ Coverage report included
- ✅ Proper exit codes for CI systems
- ✅ Optimized worker count

---

## Docker Test Scripts

### `npm run test:docker`

**Purpose:** Runs all tests in Docker containers.

**Command:** `docker-compose --profile test up --build --abort-on-container-exit --exit-code-from test test`

**What it does:**

- Starts PostgreSQL container
- Creates test database automatically
- Builds test container with all dependencies
- Runs all tests in isolated Docker environment
- Stops containers after tests complete
- Exits with test result code (0 = pass, 1 = fail)

**When to use:**

- To ensure consistent test environment
- When you don't have local database setup
- For testing in isolated environment
- In CI/CD pipelines

**Example:**

```bash
npm run test:docker
```

**Benefits:**

- ✅ No local database setup required
- ✅ Consistent environment across machines
- ✅ Isolated from local system
- ✅ Automatic cleanup

**Requirements:**

- Docker and Docker Compose installed
- Docker daemon running

---

### `npm run test:docker:watch`

**Purpose:** Runs tests in watch mode inside Docker container.

**Command:** `docker-compose --profile test run --rm test npm run test:watch`

**What it does:**

- Uses existing test container (doesn't rebuild)
- Runs tests in watch mode
- Automatically re-runs tests on file changes
- Removes container after exit (`--rm`)

**Prerequisites:**

- Database container must be running:
  ```bash
  docker-compose --profile test up -d postgres
  ```

**When to use:**

- For test development in Docker environment
- When you want watch mode with Docker isolation

**Example:**

```bash
# Start database first
docker-compose --profile test up -d postgres

# Run tests in watch mode
npm run test:docker:watch
```

---

### `npm run test:docker:coverage`

**Purpose:** Runs tests with coverage report in Docker.

**Command:** `docker-compose --profile test run --rm test npm run test:coverage`

**What it does:**

- Runs all tests in Docker container
- Generates coverage report
- Coverage files are saved in container (accessible via volumes)

**Prerequisites:**

- Database container must be running:
  ```bash
  docker-compose --profile test up -d postgres
  ```

**When to use:**

- To get coverage report in Docker environment
- For CI/CD with coverage requirements

**Example:**

```bash
# Start database first
docker-compose --profile test up -d postgres

# Run tests with coverage
npm run test:docker:coverage
```

---

## Code Quality Scripts

### `npm run format`

**Purpose:** Formats code using Prettier.

**Command:** `prettier --write "src/**/*.{ts,json}" "tests/**/*.{ts,json}" "*.{js,json,md}"`

**What it does:**

- Formats all TypeScript files in `src/`
- Formats all test files in `tests/`
- Formats JSON files
- Formats Markdown files
- Formats JavaScript config files
- **Overwrites files** with formatted version

**When to use:**

- Before committing code
- To fix formatting issues
- To ensure consistent code style

**Example:**

```bash
npm run format
```

**Files Formatted:**

- `src/**/*.ts` - All TypeScript source files
- `tests/**/*.ts` - All test files
- `*.json` - JSON configuration files
- `*.md` - Markdown documentation
- `*.js` - JavaScript config files (jest.config.js, etc.)

---

### `npm run format:check`

**Purpose:** Checks code formatting without making changes.

**Command:** `prettier --check "src/**/*.{ts,json}" "tests/**/*.{ts,json}" "*.{js,json,md}"`

**What it does:**

- Checks if files are properly formatted
- Does NOT modify files
- Exits with error code if files need formatting
- Shows which files need formatting

**When to use:**

- In CI/CD pipelines
- Before committing (to check if formatting is needed)
- To verify code style compliance

**Example:**

```bash
npm run format:check
```

**Exit Codes:**

- `0` - All files are properly formatted
- `1` - Some files need formatting

**Use in CI:**

```yaml
# Example GitHub Actions
- run: npm run format:check
```

---

### `npm run lint`

**Purpose:** Alias for `format:check` - checks code formatting.

**Command:** `npm run format:check`

**What it does:**

- Same as `npm run format:check`
- Convenient alias for linting/formatting checks

**When to use:**

- As an alternative to `format:check`
- When you prefer the `lint` command name

**Example:**

```bash
npm run lint
```

---

## Utility Scripts

### `npm run prepare`

**Purpose:** Installs Husky git hooks (runs automatically).

**Command:** `husky install || true`

**What it does:**

- Installs Husky for git hooks management
- Sets up pre-commit hooks
- Runs automatically after `npm install`
- The `|| true` ensures it doesn't fail if Husky is already installed

**When it runs:**

- Automatically after `npm install`
- When you clone the repository and run `npm install`
- Manually if needed: `npm run prepare`

**What it sets up:**

- Pre-commit hook that runs:
  1. Code formatting (lint-staged)
  2. TypeScript build check
  3. Tests

**Example:**

```bash
npm install  # prepare runs automatically
# or manually:
npm run prepare
```

---

## Script Usage Summary

### Daily Development Workflow

```bash
# Start development server
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch

# Format code before committing
npm run format

# Check formatting
npm run format:check
```

### Before Committing

```bash
# Format code
npm run format

# Run tests
npm test

# Build to check for TypeScript errors
npm run build
```

### Production Deployment

```bash
# Clean old build
npm run clean

# Build for production
npm run build

# Run tests
npm test

# Start production server
npm start
```

### CI/CD Pipeline

```bash
# Check formatting
npm run format:check

# Run tests with coverage
npm run test:ci

# Or use Docker
npm run test:docker
```

---

## Script Categories

| Category             | Scripts                                                    |
| -------------------- | ---------------------------------------------------------- |
| **Build**            | `build`, `start`, `dev`, `clean`                           |
| **Testing (Local)**  | `test`, `test:watch`, `test:coverage`, `test:ci`           |
| **Testing (Docker)** | `test:docker`, `test:docker:watch`, `test:docker:coverage` |
| **Code Quality**     | `format`, `format:check`, `lint`                           |
| **Utilities**        | `prepare`                                                  |

---

## Common Issues & Solutions

### Tests fail with database connection error

**Solution:** Make sure database is running

```bash
docker-compose up -d postgres
```

### Format check fails in CI

**Solution:** Run format before committing

```bash
npm run format
git add .
git commit
```

### Build fails with TypeScript errors

**Solution:** Check TypeScript errors

```bash
npm run build
# Fix errors shown, then rebuild
```

### Docker tests fail

**Solution:** Rebuild containers

```bash
docker-compose --profile test build --no-cache test
npm run test:docker
```

---

## Additional Notes

- All scripts can be run with `npm run <script-name>`
- Some scripts have aliases (e.g., `lint` = `format:check`)
- Test scripts use real database (test environment)
- Docker scripts require Docker to be installed and running
- Format scripts use Prettier configuration (if present)
- Pre-commit hooks run automatically via Husky

---

## Quick Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm start                # Start production

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run test:docker      # In Docker

# Code Quality
npm run format           # Format code
npm run format:check     # Check formatting
npm run lint             # Alias for format:check

# Utilities
npm run clean            # Remove dist/
npm run prepare           # Setup git hooks
```
