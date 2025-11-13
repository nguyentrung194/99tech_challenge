/**
 * Test API Key - used for testing purposes
 * In tests, we set this as the valid API key
 */
export const TEST_API_KEY = 'test-api-key-12345';

/**
 * Helper function to set API key in environment for tests
 */
export const setupTestApiKey = (): void => {
  process.env.API_KEY = TEST_API_KEY;
};

/**
 * Helper function to get request with API key header
 */
export const withApiKey = (apiKey: string = TEST_API_KEY) => {
  return {
    'X-API-Key': apiKey,
  };
};
