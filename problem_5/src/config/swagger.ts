import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD Server API',
      version: '1.0.0',
      description:
        'A production-ready CRUD backend server built with ExpressJS and TypeScript. This API provides full CRUD operations for managing resources with filtering, pagination, and validation.',
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Default server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for authentication. Get your API key from the administrator.',
        },
      },
      schemas: {
        Resource: {
          type: 'object',
          required: ['id', 'name', 'description', 'status', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the resource',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Name of the resource',
              maxLength: 255,
              example: 'My Resource',
            },
            description: {
              type: 'string',
              description: 'Description of the resource',
              maxLength: 1000,
              example: 'This is a resource description',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Status of the resource',
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the resource was created',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the resource was last updated',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateResourceDto: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the resource',
              maxLength: 255,
              example: 'My Resource',
            },
            description: {
              type: 'string',
              description: 'Description of the resource',
              maxLength: 1000,
              example: 'This is a resource description',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Status of the resource (optional, defaults to active)',
              example: 'active',
            },
          },
        },
        UpdateResourceDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the resource',
              maxLength: 255,
              example: 'Updated Resource Name',
            },
            description: {
              type: 'string',
              description: 'Description of the resource',
              maxLength: 1000,
              example: 'Updated description',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Status of the resource',
              example: 'inactive',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
              example: 1,
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page',
              example: 10,
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
              example: 100,
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 10,
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              $ref: '#/components/schemas/Resource',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Resource',
              },
            },
            pagination: {
              $ref: '#/components/schemas/Pagination',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Error message',
                },
                statusCode: {
                  type: 'integer',
                  example: 400,
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Resources',
        description: 'Resource management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoint',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts', './dist/routes/*.js', './dist/index.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
