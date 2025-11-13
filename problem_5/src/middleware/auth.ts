import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

/**
 * API Key Authentication Middleware
 * Validates API key from request header or query parameter
 */
export const authenticateApiKey = (req: Request, _res: Response, next: NextFunction): void => {
  // Get API key from environment variable
  const validApiKey = process.env.API_KEY;

  // If no API key is configured, skip authentication (for development)
  if (!validApiKey) {
    console.warn('⚠️  API_KEY not configured. API is running without authentication.');
    return next();
  }

  // Try to get API key from header (preferred method)
  const apiKeyFromHeader = req.headers['x-api-key'] as string;

  // Try to get API key from query parameter (alternative method)
  const apiKeyFromQuery = req.query.apiKey as string;

  // Get API key from either source
  const providedApiKey = apiKeyFromHeader || apiKeyFromQuery;

  // Validate API key
  if (!providedApiKey) {
    throw new UnauthorizedError(
      'API key is required. Please provide it in the X-API-Key header or apiKey query parameter.'
    );
  }

  if (providedApiKey !== validApiKey) {
    throw new UnauthorizedError('Invalid API key.');
  }

  // API key is valid, proceed to next middleware
  next();
};
