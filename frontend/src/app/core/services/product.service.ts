import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import type {
  Product,
  ProductPage,
  ProductQuery,
  ProductStatus,
} from '../models/api.models';

export interface ProductPayload {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  featured: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  list(query: ProductQuery): Observable<ProductPage> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return this.http.get<ProductPage>('/api/products', { params });
  }

  get(id: string): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  categories(): Observable<{ categories: string[] }> {
    return this.http.get<{ categories: string[] }>('/api/products/categories');
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>('/api/products', payload, {
      withCredentials: true,
    });
  }

  update(id: string, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`/api/products/${id}`, payload, {
      withCredentials: true,
    });
  }

  remove(id: string): Observable<{ id: string; deleted: true }> {
    return this.http.delete<{ id: string; deleted: true }>(
      `/api/products/${id}`,
      { withCredentials: true },
    );
  }

  bulkRemove(ids: string[]): Observable<{ deleted: number }> {
    return this.http.delete<{ deleted: number }>('/api/products/bulk', {
      body: { ids },
      withCredentials: true,
    });
  }

  bulkUpdateStatus(
    ids: string[],
    status: ProductStatus,
  ): Observable<{ updated: number }> {
    return this.http.patch<{ updated: number }>(
      '/api/products/bulk/status',
      { ids, status },
      { withCredentials: true },
    );
  }
}
