export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPage {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  status?: ProductStatus;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  delayMs?: number;
}

export interface FeedPage {
  items: { id: number; title: string; body: string }[];
  nextCursor: number | null;
  total: number;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: string[];
}
