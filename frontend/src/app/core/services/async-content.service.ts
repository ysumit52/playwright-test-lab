import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import type { FeedPage, SearchResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AsyncContentService {
  private readonly http = inject(HttpClient);

  search(term: string, delayMs = 400): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', term)
      .set('delayMs', String(delayMs));

    return this.http.get<SearchResponse>('/api/async/search', { params });
  }

  feed(cursor: number, limit = 20): Observable<FeedPage> {
    const params = new HttpParams()
      .set('cursor', String(cursor))
      .set('limit', String(limit));

    return this.http.get<FeedPage>('/api/async/feed', { params });
  }

  slow(ms: number): Observable<{ message: string; delayedMs: number }> {
    const params = new HttpParams().set('ms', String(ms));

    return this.http.get<{ message: string; delayedMs: number }>(
      '/api/async/slow',
      { params },
    );
  }
}
