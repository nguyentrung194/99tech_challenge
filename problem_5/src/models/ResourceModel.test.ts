import { ResourceModel } from './ResourceModel';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeDatabaseConnection,
} from '../../tests/helpers/database';
import { CreateResourceDto, UpdateResourceDto } from '../types';

describe('ResourceModel', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe('create', () => {
    it('should create a resource successfully', async () => {
      const createData: CreateResourceDto = {
        name: 'Test Resource',
        description: 'Test Description',
        status: 'active',
      };

      const result = await ResourceModel.create(createData);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(createData.name);
      expect(result.description).toBe(createData.description);
      expect(result.status).toBe(createData.status);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should use default status if not provided', async () => {
      const createData: CreateResourceDto = {
        name: 'Test Resource Default',
        description: 'Test Description',
      };

      const result = await ResourceModel.create(createData);

      expect(result.status).toBe('active');
      expect(result.name).toBe(createData.name);
    });
  });

  describe('findById', () => {
    it('should return a resource by id', async () => {
      // Create a resource first
      const createData: CreateResourceDto = {
        name: 'Find Test Resource',
        description: 'Test Description',
        status: 'active',
      };
      const created = await ResourceModel.create(createData);

      // Find it by id
      const result = await ResourceModel.findById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.name).toBe(createData.name);
      expect(result?.description).toBe(createData.description);
    });

    it('should return null if resource does not exist', async () => {
      const result = await ResourceModel.findById(99999);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated resources', async () => {
      // Create some test resources
      await ResourceModel.create({
        name: 'Resource 1',
        description: 'Description 1',
        status: 'active',
      });
      await ResourceModel.create({
        name: 'Resource 2',
        description: 'Description 2',
        status: 'active',
      });

      const result = await ResourceModel.findAll();

      expect(result.data.length).toBeGreaterThanOrEqual(2);
      expect(result.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });
      expect(result.pagination.total).toBeGreaterThanOrEqual(2);
    });

    it('should filter by status', async () => {
      // Create resources with different statuses
      await ResourceModel.create({
        name: 'Active Resource',
        description: 'Active description',
        status: 'active',
      });
      await ResourceModel.create({
        name: 'Inactive Resource',
        description: 'Inactive description',
        status: 'inactive',
      });

      const result = await ResourceModel.findAll({ status: 'active' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(resource => {
        expect(resource.status).toBe('active');
      });
    });

    it('should search by name or description', async () => {
      // Create resources with searchable content
      await ResourceModel.create({
        name: 'Searchable Resource',
        description: 'This is searchable',
        status: 'active',
      });
      await ResourceModel.create({
        name: 'Another Resource',
        description: 'Not matching',
        status: 'active',
      });

      const result = await ResourceModel.findAll({ search: 'Searchable' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(resource => {
        const nameMatch = resource.name.toLowerCase().includes('searchable');
        const descMatch = resource.description.toLowerCase().includes('searchable');
        expect(nameMatch || descMatch).toBe(true);
      });
    });

    it('should handle pagination correctly', async () => {
      // Create multiple resources
      for (let i = 1; i <= 5; i++) {
        await ResourceModel.create({
          name: `Pagination Resource ${i}`,
          description: `Description ${i}`,
          status: 'active',
        });
      }

      const page1 = await ResourceModel.findAll({ page: 1, limit: 2 });
      expect(page1.data.length).toBeLessThanOrEqual(2);
      expect(page1.pagination.page).toBe(1);
      expect(page1.pagination.limit).toBe(2);

      const page2 = await ResourceModel.findAll({ page: 2, limit: 2 });
      expect(page2.pagination.page).toBe(2);
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      // Create a resource first
      const created = await ResourceModel.create({
        name: 'Original Name',
        description: 'Original Description',
        status: 'active',
      });

      const updateData: UpdateResourceDto = {
        name: 'Updated Name',
      };

      const result = await ResourceModel.update(created.id, updateData);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.name).toBe('Updated Name');
      expect(result?.description).toBe('Original Description'); // Should remain unchanged
      expect(result?.updatedAt).not.toBe(created.updatedAt); // Should be updated
    });

    it('should return null if resource does not exist', async () => {
      const result = await ResourceModel.update(99999, { name: 'Updated' });

      expect(result).toBeNull();
    });

    it('should update multiple fields', async () => {
      const created = await ResourceModel.create({
        name: 'Multi Update Resource',
        description: 'Original Description',
        status: 'active',
      });

      const result = await ResourceModel.update(created.id, {
        name: 'Updated Name',
        status: 'inactive',
      });

      expect(result?.name).toBe('Updated Name');
      expect(result?.status).toBe('inactive');
    });
  });

  describe('delete', () => {
    it('should delete a resource', async () => {
      // Create a resource first
      const created = await ResourceModel.create({
        name: 'Delete Test Resource',
        description: 'To be deleted',
        status: 'active',
      });

      const result = await ResourceModel.delete(created.id);

      expect(result).toBe(true);

      // Verify it's deleted
      const found = await ResourceModel.findById(created.id);
      expect(found).toBeNull();
    });

    it('should return false if resource does not exist', async () => {
      const result = await ResourceModel.delete(99999);

      expect(result).toBe(false);
    });
  });
});
