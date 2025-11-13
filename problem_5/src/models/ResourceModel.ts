import pool from '../config/database';
import {
  Resource,
  CreateResourceDto,
  UpdateResourceDto,
  ResourceFilters,
  PaginatedResponse,
} from '../types';

export class ResourceModel {
  static async create(data: CreateResourceDto): Promise<Resource> {
    const status = data.status || 'active';
    const query = `
      INSERT INTO resources (name, description, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [data.name, data.description, status]);
    return this.mapRowToResource(result.rows[0]);
  }

  static async findById(id: number): Promise<Resource | null> {
    const query = 'SELECT * FROM resources WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToResource(result.rows[0]);
  }

  static async findAll(filters: ResourceFilters = {}): Promise<PaginatedResponse<Resource>> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
      paramIndex += 2;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM resources ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated results
    const query = `
      SELECT * FROM resources 
      ${whereClause}
      ORDER BY "createdAt" DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const resources = result.rows.map(row => this.mapRowToResource(row));

    return {
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async update(id: number, data: UpdateResourceDto): Promise<Resource | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(data.description);
      paramIndex++;
    }

    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      params.push(data.status);
      paramIndex++;
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);
    // Add id parameter for WHERE clause
    const idParamIndex = paramIndex;
    params.push(id);

    const query = `UPDATE resources SET ${updates.join(', ')} WHERE id = $${idParamIndex} RETURNING *`;
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToResource(result.rows[0]);
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM resources WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private static mapRowToResource(row: any): Resource {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
    };
  }
}
