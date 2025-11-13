import dotenv from 'dotenv';
import { setupTestApiKey } from './helpers/auth';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test database configuration
// Use TEST_DB_* variables if available, otherwise use defaults
process.env.DB_NAME = process.env.TEST_DB_NAME || 'test_crud_db';
process.env.DB_USER = process.env.TEST_DB_USER || process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres';
process.env.DB_HOST = process.env.TEST_DB_HOST || process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.TEST_DB_PORT || process.env.DB_PORT || '5432';
process.env.NODE_ENV = 'test';

// Set test API key
setupTestApiKey();
