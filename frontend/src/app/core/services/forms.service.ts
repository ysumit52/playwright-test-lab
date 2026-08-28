import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

export interface SubmissionResponse {
  message: string;
  submissionId: string;
}

@Injectable({ providedIn: 'root' })
export class FormsService {
  private readonly http = inject(HttpClient);

  submitContact(payload: Record<string, unknown>): Observable<SubmissionResponse> {
    return this.http.post<SubmissionResponse>('/api/forms/contact', payload);
  }

  submitWizard(payload: Record<string, unknown>): Observable<SubmissionResponse> {
    return this.http.post<SubmissionResponse>('/api/forms/wizard', payload);
  }

  upload(files: File[]): Observable<SubmissionResponse & { files: unknown[] }> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    return this.http.post<SubmissionResponse & { files: unknown[] }>(
      '/api/forms/upload',
      formData,
    );
  }
}
