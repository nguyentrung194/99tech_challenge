export interface Resource {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceDto {
  name: string;
  description: string;
  status?: 'active' | 'inactive';
}

export interface UpdateResourceDto {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface ResourceFilters {
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
