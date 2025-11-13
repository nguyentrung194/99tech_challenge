import { ResourceModel } from '../models/ResourceModel';
import {
  CreateResourceDto,
  UpdateResourceDto,
  ResourceFilters,
  PaginatedResponse,
  Resource,
} from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';

export class ResourceService {
  static async create(data: CreateResourceDto): Promise<Resource> {
    this.validateCreateData(data);
    return await ResourceModel.create(data);
  }

  static async findById(id: number): Promise<Resource> {
    const resource = await ResourceModel.findById(id);
    if (!resource) {
      throw new NotFoundError(`Resource with id ${id} not found`);
    }
    return resource;
  }

  static async findAll(filters: ResourceFilters = {}): Promise<PaginatedResponse<Resource>> {
    // Validate pagination parameters
    if (filters.page !== undefined && filters.page < 1) {
      throw new ValidationError('Page must be greater than 0');
    }
    if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    return await ResourceModel.findAll(filters);
  }

  static async update(id: number, data: UpdateResourceDto): Promise<Resource> {
    this.validateUpdateData(data);
    const resource = await ResourceModel.update(id, data);
    if (!resource) {
      throw new NotFoundError(`Resource with id ${id} not found`);
    }
    return resource;
  }

  static async delete(id: number): Promise<void> {
    const deleted = await ResourceModel.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Resource with id ${id} not found`);
    }
  }

  private static validateCreateData(data: CreateResourceDto): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }
    if (data.name.length > 255) {
      throw new ValidationError('Name must be less than 255 characters');
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new ValidationError('Description is required');
    }
    if (data.description.length > 1000) {
      throw new ValidationError('Description must be less than 1000 characters');
    }
    if (data.status && !['active', 'inactive'].includes(data.status)) {
      throw new ValidationError('Status must be either "active" or "inactive"');
    }
  }

  private static validateUpdateData(data: UpdateResourceDto): void {
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new ValidationError('Name cannot be empty');
      }
      if (data.name.length > 255) {
        throw new ValidationError('Name must be less than 255 characters');
      }
    }
    if (data.description !== undefined) {
      if (data.description.trim().length === 0) {
        throw new ValidationError('Description cannot be empty');
      }
      if (data.description.length > 1000) {
        throw new ValidationError('Description must be less than 1000 characters');
      }
    }
    if (data.status !== undefined && !['active', 'inactive'].includes(data.status)) {
      throw new ValidationError('Status must be either "active" or "inactive"');
    }
  }
}
