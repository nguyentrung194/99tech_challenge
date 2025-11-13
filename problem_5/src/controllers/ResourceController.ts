import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/ResourceService';
import { CreateResourceDto, UpdateResourceDto, ResourceFilters } from '../types';

export class ResourceController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateResourceDto = req.body;
      const resource = await ResourceService.create(data);
      res.status(201).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ResourceFilters = {
        status: req.query.status as 'active' | 'inactive' | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };
      const result = await ResourceService.findAll(filters);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid resource ID',
            statusCode: 400,
          },
        });
        return;
      }
      const resource = await ResourceService.findById(id);
      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid resource ID',
            statusCode: 400,
          },
        });
        return;
      }
      const data: UpdateResourceDto = req.body;
      const resource = await ResourceService.update(id, data);
      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid resource ID',
            statusCode: 400,
          },
        });
        return;
      }
      await ResourceService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
