import request from 'supertest';
import app from '../../src/index';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeDatabaseConnection,
} from '../helpers/database';
import { withApiKey, TEST_API_KEY } from '../helpers/auth';

describe('Resources API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe('POST /api/resources', () => {
    it('should create a new resource', async () => {
      const resourceData = {
        name: 'Test Resource',
        description: 'This is a test resource',
        status: 'active',
      };

      const response = await request(app)
        .post('/api/resources')
        .set(withApiKey())
        .send(resourceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: resourceData.name,
        description: resourceData.description,
        status: resourceData.status,
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should create resource with default status active', async () => {
      const resourceData = {
        name: 'Test Resource',
        description: 'This is a test resource',
      };

      const response = await request(app)
        .post('/api/resources')
        .set(withApiKey())
        .send(resourceData)
        .expect(201);

      expect(response.body.data.status).toBe('active');
    });

    it('should return 400 if name is missing', async () => {
      const resourceData = {
        description: 'This is a test resource',
      };

      const response = await request(app)
        .post('/api/resources')
        .set(withApiKey())
        .send(resourceData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Name is required');
    });

    it('should return 400 if description is missing', async () => {
      const resourceData = {
        name: 'Test Resource',
      };

      const response = await request(app)
        .post('/api/resources')
        .set(withApiKey())
        .send(resourceData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Description is required');
    });
  });

  describe('GET /api/resources', () => {
    beforeEach(async () => {
      // Create test resources
      await request(app).post('/api/resources').set(withApiKey()).send({
        name: 'Active Resource',
        description: 'An active resource',
        status: 'active',
      });

      await request(app).post('/api/resources').set(withApiKey()).send({
        name: 'Inactive Resource',
        description: 'An inactive resource',
        status: 'inactive',
      });

      await request(app).post('/api/resources').set(withApiKey()).send({
        name: 'Another Active',
        description: 'Another active resource',
        status: 'active',
      });
    });

    it('should return all resources with pagination', async () => {
      const response = await request(app).get('/api/resources').set(withApiKey()).expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });
    });

    it('should filter resources by status', async () => {
      const response = await request(app)
        .get('/api/resources?status=active')
        .set(withApiKey())
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((resource: any) => {
        expect(resource.status).toBe('active');
      });
    });

    it('should search resources by name or description', async () => {
      const response = await request(app)
        .get('/api/resources?search=Active')
        .set(withApiKey())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((resource: any) => {
        expect(
          resource.name.toLowerCase().includes('active') ||
            resource.description.toLowerCase().includes('active')
        ).toBe(true);
      });
    });

    it('should paginate results correctly', async () => {
      const response = await request(app)
        .get('/api/resources?page=1&limit=2')
        .set(withApiKey())
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/resources/:id', () => {
    let createdResourceId: number;

    beforeEach(async () => {
      const response = await request(app).post('/api/resources').set(withApiKey()).send({
        name: 'Test Resource',
        description: 'Test Description',
        status: 'active',
      });
      createdResourceId = response.body.data.id;
    });

    it('should return a resource by id', async () => {
      const response = await request(app)
        .get(`/api/resources/${createdResourceId}`)
        .set(withApiKey())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdResourceId);
      expect(response.body.data.name).toBe('Test Resource');
    });

    it('should return 404 if resource does not exist', async () => {
      const response = await request(app).get('/api/resources/99999').set(withApiKey()).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('not found');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .get('/api/resources/invalid')
        .set(withApiKey())
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/resources/:id', () => {
    let createdResourceId: number;

    beforeEach(async () => {
      const response = await request(app).post('/api/resources').set(withApiKey()).send({
        name: 'Test Resource',
        description: 'Test Description',
        status: 'active',
      });
      createdResourceId = response.body.data.id;
    });

    it('should update a resource', async () => {
      const updateData = {
        name: 'Updated Resource',
        status: 'inactive',
      };

      const response = await request(app)
        .put(`/api/resources/${createdResourceId}`)
        .set(withApiKey())
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.id).toBe(createdResourceId);
    });

    it('should update only provided fields', async () => {
      const updateData = {
        status: 'inactive',
      };

      const response = await request(app)
        .put(`/api/resources/${createdResourceId}`)
        .set(withApiKey())
        .send(updateData)
        .expect(200);

      expect(response.body.data.status).toBe('inactive');
      // Original name should remain
      expect(response.body.data.name).toBe('Test Resource');
    });

    it('should return 404 if resource does not exist', async () => {
      const response = await request(app)
        .put('/api/resources/99999')
        .set(withApiKey())
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/resources/:id', () => {
    let createdResourceId: number;

    beforeEach(async () => {
      const response = await request(app).post('/api/resources').set(withApiKey()).send({
        name: 'Test Resource',
        description: 'Test Description',
        status: 'active',
      });
      createdResourceId = response.body.data.id;
    });

    it('should delete a resource', async () => {
      const response = await request(app)
        .delete(`/api/resources/${createdResourceId}`)
        .set(withApiKey())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify resource is deleted
      await request(app).get(`/api/resources/${createdResourceId}`).set(withApiKey()).expect(404);
    });

    it('should return 404 if resource does not exist', async () => {
      const response = await request(app)
        .delete('/api/resources/99999')
        .set(withApiKey())
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('API Key Authentication', () => {
    it('should return 401 if API key is missing', async () => {
      const response = await request(app).get('/api/resources').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('API key is required');
    });

    it('should return 401 if API key is invalid', async () => {
      const response = await request(app)
        .get('/api/resources')
        .set(withApiKey('invalid-key'))
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid API key');
    });

    it('should accept API key from query parameter', async () => {
      const response = await request(app).get(`/api/resources?apiKey=${TEST_API_KEY}`).expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
