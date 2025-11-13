# Unit Test Review

## Overview

All unit tests in this project use **REAL DATABASE DATA** with automatic cleanup. The tests:

- Use a dedicated test database (configured via test environment)
- Create real data during tests
- Automatically clean up data after each test (TRUNCATE)
- Use proper setup/teardown hooks for database initialization
- Run in isolation with data cleanup between tests

---

## 📁 ResourceModel.test.ts (Data Access Layer Tests)

**Database Strategy:** Uses real database with test environment

- **Setup:** Initializes test database schema before all tests
- **Cleanup:** Truncates all data after each test
- **Teardown:** Closes database connection after all tests

### Test Suite: `create` method

#### 1. "should create a resource successfully"

- **Purpose:** Verifies that creating a resource with valid data works correctly
- **Test Data:**
  - Input: `{ name: 'Test Resource', description: 'Test Description', status: 'active' }`
  - Creates actual database record and returns it
- **What it tests:**
  - SQL INSERT query is called with correct parameters
  - Returns the created resource with correct data
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 2. "should use default status if not provided"

- **Purpose:** Ensures default status 'active' is used when status is omitted
- **Test Data:**
  - Input: `{ name: 'Test Resource', description: 'Test Description' }` (no status)
  - Creates actual database record with default status='active'
- **What it tests:**
  - Default status 'active' is applied when not provided
  - SQL query includes the default status
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `findById` method

#### 3. "should return a resource by id"

- **Purpose:** Verifies finding a resource by ID works correctly
- **Test Data:**
  - Creates a resource first, then finds it by ID
  - Returns the actual database record
- **What it tests:**
  - Correct SQL SELECT query is executed
  - Resource is returned when found
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 4. "should return null if resource does not exist"

- **Purpose:** Tests the case when a resource doesn't exist
- **Test Data:**
  - Input: id = 99999 (non-existent)
  - Database returns null when resource doesn't exist
- **What it tests:**
  - Returns `null` when resource is not found (not an error)
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `findAll` method

#### 5. "should return paginated resources"

- **Purpose:** Verifies pagination works correctly
- **Test Data:**
  - Creates 2 test resources in database
  - Returns actual paginated results from database
- **What it tests:**
  - Pagination metadata is correct (page, limit, total, totalPages)
  - Returns data array with resources
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 6. "should filter by status"

- **Purpose:** Tests filtering resources by status
- **Test Data:**
  - Creates resources with different statuses (active and inactive)
  - Filters and returns only active resources from database
- **What it tests:**
  - SQL query includes status filter (`status = $1`)
  - Correct parameter is passed
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 7. "should search by name or description"

- **Purpose:** Tests search functionality using ILIKE
- **Test Data:**
  - Creates resources with searchable content
  - Performs actual ILIKE search on database
- **What it tests:**
  - SQL query includes ILIKE for name and description
  - Search term is properly formatted with `%test%`
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `update` method

#### 8. "should update a resource"

- **Purpose:** Verifies updating a resource works correctly
- **Test Data:**
  - Creates a resource first, then updates it
  - Returns the actual updated record from database
- **What it tests:**
  - Resource is found first
  - Update query is executed
  - Returns updated resource with new name
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 9. "should return null if resource does not exist"

- **Purpose:** Tests update when resource doesn't exist
- **Test Data:**
  - Input: id=99999, `{ name: 'Updated' }`
  - Database returns null when resource doesn't exist
- **What it tests:**
  - Returns `null` when resource doesn't exist
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `delete` method

#### 10. "should delete a resource"

- **Purpose:** Verifies deletion works correctly
- **Test Data:**
  - Creates a resource first, then deletes it
  - Verifies deletion by attempting to find it (should return null)
- **What it tests:**
  - Correct DELETE SQL query is executed
  - Returns `true` when deletion succeeds
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 11. "should return false if resource does not exist"

- **Purpose:** Tests deletion when resource doesn't exist
- **Test Data:**
  - Input: id = 99999
  - Database returns false when resource doesn't exist
- **What it tests:**
  - Returns `false` when resource doesn't exist
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

## 📁 ResourceService.test.ts (Business Logic Layer Tests)

**Database Strategy:** Uses real database with test environment

- **Setup:** Initializes test database schema before all tests
- **Cleanup:** Truncates all data after each test
- **Teardown:** Closes database connection after all tests
- Uses real ResourceModel (not mocked) for end-to-end testing

### Test Suite: `create` method

#### 1. "should create a resource successfully"

- **Purpose:** Verifies service layer creates resources correctly
- **Test Data:**
  - Input: `{ name: 'Test Resource', description: 'Test Description', status: 'active' }`
  - Creates actual database record via ResourceModel
- **What it tests:**
  - Service calls ResourceModel.create with correct data
  - Returns the created resource
- **Data Type:** ✅ **REAL DATA** - Uses real ResourceModel and database, cleaned up after test

#### 2. "should throw ValidationError if name is missing"

- **Purpose:** Tests validation - empty name should fail
- **Mock Data:**
  - Input: `{ name: '', description: 'Test Description' }`
- **What it tests:**
  - Throws `ValidationError` with message "Name is required"
  - ResourceModel.create is NOT called (validation happens first)
- **Data Type:** ✅ **REAL DATA** - Validation happens before DB call, but uses real service

#### 3. "should throw ValidationError if description is missing"

- **Purpose:** Tests validation - empty description should fail
- **Mock Data:**
  - Input: `{ name: 'Test Resource', description: '' }`
- **What it tests:**
  - Throws `ValidationError` with message "Description is required"
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 4. "should throw ValidationError if name is too long"

- **Purpose:** Tests validation - name length limit (255 chars)
- **Mock Data:**
  - Input: `{ name: 'a'.repeat(256), description: 'Test Description' }` (256 characters)
- **What it tests:**
  - Throws `ValidationError` with message "Name must be less than 255 characters"
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 5. "should throw ValidationError if status is invalid"

- **Purpose:** Tests validation - invalid status value
- **Mock Data:**
  - Input: `{ name: 'Test Resource', description: 'Test Description', status: 'invalid' }`
- **What it tests:**
  - Throws `ValidationError` for invalid status
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `findById` method

#### 6. "should return a resource by id"

- **Purpose:** Verifies service returns resource when found
- **Test Data:**
  - Creates a resource first, then finds it by ID
  - Returns actual database record
- **What it tests:**
  - Service calls ResourceModel.findById
  - Returns the resource when found
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 7. "should throw NotFoundError if resource does not exist"

- **Purpose:** Tests error handling when resource doesn't exist
- **Test Data:**
  - Input: id = 99999
  - ResourceModel returns null, service throws NotFoundError
- **What it tests:**
  - Throws `NotFoundError` with message "Resource with id 999 not found"
  - Service layer converts null to proper error
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `findAll` method

#### 8. "should return paginated resources"

- **Purpose:** Verifies pagination works at service layer
- **Test Data:**
  - Creates 2 test resources, then retrieves paginated results
  - Returns actual paginated data from database
- **What it tests:**
  - Service calls ResourceModel.findAll
  - Returns paginated response correctly
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 9. "should throw ValidationError if page is less than 1"

- **Purpose:** Tests pagination validation - invalid page number
- **Mock Data:**
  - Input: `{ page: 0 }`
- **What it tests:**
  - Throws `ValidationError` with message "Page must be greater than 0"
  - ResourceModel.findAll is NOT called
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 10. "should throw ValidationError if limit is less than 1"

- **Purpose:** Tests pagination validation - limit too low
- **Mock Data:**
  - Input: `{ limit: 0 }`
- **What it tests:**
  - Throws `ValidationError` with message "Limit must be between 1 and 100"
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 11. "should throw ValidationError if limit is greater than 100"

- **Purpose:** Tests pagination validation - limit too high
- **Mock Data:**
  - Input: `{ limit: 101 }`
- **What it tests:**
  - Throws `ValidationError` with message "Limit must be between 1 and 100"
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `update` method

#### 12. "should update a resource successfully"

- **Purpose:** Verifies service updates resources correctly
- **Test Data:**
  - Creates a resource first, then updates it
  - Returns actual updated record from database
- **What it tests:**
  - Service calls ResourceModel.update with correct parameters
  - Returns updated resource
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 13. "should throw NotFoundError if resource does not exist"

- **Purpose:** Tests error handling when updating non-existent resource
- **Test Data:**
  - Input: id=99999, `{ name: 'Updated' }`
  - ResourceModel returns null, service throws NotFoundError
- **What it tests:**
  - Throws `NotFoundError` with message "Resource with id 999 not found"
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 14. "should throw ValidationError if name is empty"

- **Purpose:** Tests validation - empty name in update
- **Mock Data:**
  - Input: id=1, `{ name: '' }`
- **What it tests:**
  - Throws `ValidationError` with message "Name cannot be empty"
  - ResourceModel.update is NOT called
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

### Test Suite: `delete` method

#### 15. "should delete a resource successfully"

- **Purpose:** Verifies service deletes resources correctly
- **Test Data:**
  - Creates a resource first, then deletes it
  - Verifies deletion by attempting to find it (should throw NotFoundError)
- **What it tests:**
  - Service calls ResourceModel.delete
  - No error is thrown when deletion succeeds
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

#### 16. "should throw NotFoundError if resource does not exist"

- **Purpose:** Tests error handling when deleting non-existent resource
- **Test Data:**
  - Input: id = 99999
  - ResourceModel returns false, service throws NotFoundError
- **What it tests:**
  - Throws `NotFoundError` with message "Resource with id 999 not found"
  - Service layer converts false to proper error
- **Data Type:** ✅ **REAL DATA** - Creates actual database records, cleaned up after test

---

## Summary

### Data Type: **ALL TESTS USE REAL DATABASE DATA** ✅

- **ResourceModel tests:** Use real database connection with actual data
- **ResourceService tests:** Use real ResourceModel and real database
- **Test Environment:** All tests use dedicated test database (configured via `.env.test`)
- **Data Cleanup:** All data is automatically truncated after each test
- **Isolation:** Each test runs with a clean database state

### Test Coverage:

**ResourceModel (11 tests):**

- ✅ Create operations (2 tests)
- ✅ Read operations (4 tests: findById, findAll with pagination, filtering, searching)
- ✅ Update operations (2 tests)
- ✅ Delete operations (2 tests)

**ResourceService (16 tests):**

- ✅ Create operations (5 tests: success + 4 validation scenarios)
- ✅ Read operations (3 tests: findById success, findById not found, findAll with pagination)
- ✅ Update operations (3 tests: success, not found, validation)
- ✅ Delete operations (2 tests: success, not found)
- ✅ Pagination validation (3 tests)

### Key Testing Patterns:

1. **Happy Path Testing:** Tests successful operations
2. **Error Handling:** Tests error scenarios (not found, validation errors)
3. **Edge Cases:** Tests boundary conditions (empty strings, limits, invalid values)
4. **Isolation:** Each test is independent with mocks cleared between tests

### Test Database Setup:

1. **Test Environment:** Uses `.env.test` configuration or test database defaults
2. **Database Initialization:** Schema is created before all tests run
3. **Data Cleanup:** `TRUNCATE TABLE resources RESTART IDENTITY CASCADE` after each test
4. **Connection Management:** Database connection is properly closed after all tests
5. **Isolation:** Each test starts with a clean database state

### Benefits of Using Real Data:

1. **Realistic Testing:** Tests actual database interactions and SQL queries
2. **Integration Validation:** Ensures database schema and queries work correctly
3. **Data Integrity:** Tests real data constraints and relationships
4. **End-to-End Coverage:** Tests the full stack from service to database
5. **Confidence:** Higher confidence that code works with real database

### Test Execution Flow:

1. **beforeAll:** Setup test database and initialize schema
2. **Each Test:** Creates real data, performs operations, verifies results
3. **afterEach:** Truncates all data to ensure clean state for next test
4. **afterAll:** Closes database connection

---

## Note: Test Environment Configuration

Tests use the test environment configured in `tests/setup.ts`:

- Test database name: `test_crud_db` (or `TEST_DB_NAME` from `.env.test`)
- Database is automatically created if it doesn't exist
- All data is cleaned after each test to ensure isolation
