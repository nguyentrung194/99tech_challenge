import { Pool } from 'pg';
import pool from '../../src/config/database';
import { initializeDatabase } from '../../src/config/database';

const createTestDatabase = async (): Promise<void> => {
  // Connect to default postgres database to create test database
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  // Use test database name from environment (set in tests/setup.ts)
  const dbName = process.env.DB_NAME || 'test_crud_db';
  const client = await adminPool.connect();

  try {
    // Check if database exists
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    // Create database if it doesn't exist
    if (result.rows.length === 0) {
      // Use parameterized query for database name (though PostgreSQL doesn't support it)
      // So we need to escape it manually
      const escapedDbName = dbName.replace(/"/g, '""');
      await client.query(`CREATE DATABASE "${escapedDbName}"`);
    }
  } catch (error: any) {
    // If database already exists, that's fine
    if (error.code !== '42P04') {
      throw error;
    }
  } finally {
    client.release();
    await adminPool.end();
  }
};

export const setupTestDatabase = async (): Promise<void> => {
  // Create test database if it doesn't exist
  await createTestDatabase();
  // Initialize schema
  await initializeDatabase();
};

export const cleanupTestDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('TRUNCATE TABLE resources RESTART IDENTITY CASCADE');
  } finally {
    client.release();
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  await pool.end();
};
