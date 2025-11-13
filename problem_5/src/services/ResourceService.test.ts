import { ResourceService } from './ResourceService';
import { NotFoundError, ValidationError } from '../utils/errors';
import { CreateResourceDto, UpdateResourceDto } from '../types';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeDatabaseConnection,
} from '../../tests/helpers/database';

describe('ResourceService', () => {
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

      const result = await ResourceService.create(createData);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(createData.name);
      expect(result.description).toBe(createData.description);
      expect(result.status).toBe(createData.status);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw ValidationError if name is missing', async () => {
      const createData: CreateResourceDto = {
        name: '',
        description: 'Test Description',
      };

      await expect(ResourceService.create(createData)).rejects.toThrow(ValidationError);
      await expect(ResourceService.create(createData)).rejects.toThrow('Name is required');
    });

    it('should throw ValidationError if description is missing', async () => {
      const createData: CreateResourceDto = {
        name: 'Test Resource',
        description: '',
      };

      await expect(ResourceService.create(createData)).rejects.toThrow(ValidationError);
      await expect(ResourceService.create(createData)).rejects.toThrow('Description is required');
    });

    it('should throw ValidationError if name is too long', async () => {
      const createData: CreateResourceDto = {
        name: 'a'.repeat(256),
        description: 'Test Description',
      };

      await expect(ResourceService.create(createData)).rejects.toThrow(ValidationError);
      await expect(ResourceService.create(createData)).rejects.toThrow(
        'Name must be less than 255 characters'
      );
    });

    it('should throw ValidationError if status is invalid', async () => {
      const createData = {
        name: 'Test Resource',
        description: 'Test Description',
        status: 'invalid' as any,
      };

      await expect(ResourceService.create(createData)).rejects.toThrow(ValidationError);
    });
  });

  describe('findById', () => {
    it('should return a resource by id', async () => {
      // Create a resource first
      const created = await ResourceService.create({
        name: 'Find Service Resource',
        description: 'Test Description',
        status: 'active',
      });

      const result = await ResourceService.findById(created.id);

      expect(result).toEqual(created);
      expect(result.id).toBe(created.id);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      await expect(ResourceService.findById(99999)).rejects.toThrow(NotFoundError);
      await expect(ResourceService.findById(99999)).rejects.toThrow(
        'Resource with id 99999 not found'
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated resources', async () => {
      // Create some test resources
      await ResourceService.create({
        name: 'Service Resource 1',
        description: 'Description 1',
        status: 'active',
      });
      await ResourceService.create({
        name: 'Service Resource 2',
        description: 'Description 2',
        status: 'active',
      });

      const result = await ResourceService.findAll();

      expect(result.data.length).toBeGreaterThanOrEqual(2);
      expect(result.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });
    });

    it('should throw ValidationError if page is less than 1', async () => {
      await expect(ResourceService.findAll({ page: 0 })).rejects.toThrow(ValidationError);
      await expect(ResourceService.findAll({ page: 0 })).rejects.toThrow(
        'Page must be greater than 0'
      );
    });

    it('should throw ValidationError if limit is less than 1', async () => {
      await expect(ResourceService.findAll({ limit: 0 })).rejects.toThrow(ValidationError);
      await expect(ResourceService.findAll({ limit: 0 })).rejects.toThrow(
        'Limit must be between 1 and 100'
      );
    });

    it('should throw ValidationError if limit is greater than 100', async () => {
      await expect(ResourceService.findAll({ limit: 101 })).rejects.toThrow(ValidationError);
      await expect(ResourceService.findAll({ limit: 101 })).rejects.toThrow(
        'Limit must be between 1 and 100'
      );
    });

    it('should filter by status', async () => {
      await ResourceService.create({
        name: 'Active Service Resource',
        description: 'Active',
        status: 'active',
      });
      await ResourceService.create({
        name: 'Inactive Service Resource',
        description: 'Inactive',
        status: 'inactive',
      });

      const result = await ResourceService.findAll({ status: 'active' });

      result.data.forEach(resource => {
        expect(resource.status).toBe('active');
      });
    });
  });

  describe('update', () => {
    it('should update a resource successfully', async () => {
      // Create a resource first
      const created = await ResourceService.create({
        name: 'Update Service Resource',
        description: 'Original Description',
        status: 'active',
      });

      const updateData: UpdateResourceDto = {
        name: 'Updated Resource',
        status: 'inactive',
      };

      const result = await ResourceService.update(created.id, updateData);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe('Updated Resource');
      expect(result.status).toBe('inactive');
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      await expect(ResourceService.update(99999, { name: 'Updated' })).rejects.toThrow(
        NotFoundError
      );
      await expect(ResourceService.update(99999, { name: 'Updated' })).rejects.toThrow(
        'Resource with id 99999 not found'
      );
    });

    it('should throw ValidationError if name is empty', async () => {
      const created = await ResourceService.create({
        name: 'Validation Test',
        description: 'Test',
        status: 'active',
      });

      await expect(ResourceService.update(created.id, { name: '' })).rejects.toThrow(
        ValidationError
      );
      await expect(ResourceService.update(created.id, { name: '' })).rejects.toThrow(
        'Name cannot be empty'
      );
    });
  });

  describe('delete', () => {
    it('should delete a resource successfully', async () => {
      // Create a resource first
      const created = await ResourceService.create({
        name: 'Delete Service Resource',
        description: 'To be deleted',
        status: 'active',
      });

      await ResourceService.delete(created.id);

      // Verify it's deleted
      await expect(ResourceService.findById(created.id)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      await expect(ResourceService.delete(99999)).rejects.toThrow(NotFoundError);
      await expect(ResourceService.delete(99999)).rejects.toThrow(
        'Resource with id 99999 not found'
      );
    });
  });
});
