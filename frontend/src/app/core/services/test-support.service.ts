import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

export interface ResetResult {
  users: number;
  products: number;
  seedPassword: string;
  resetAt: string;
}

@Injectable({ providedIn: 'root' })
export class TestSupportService {
  private readonly http = inject(HttpClient);

  reset(): Observable<ResetResult> {
    return this.http.post<ResetResult>('/api/test/reset', {});
  }

  state(): Observable<{ users: number; products: number; submissions: number }> {
    return this.http.get<{ users: number; products: number; submissions: number }>(
      '/api/test/state',
    );
  }
}
