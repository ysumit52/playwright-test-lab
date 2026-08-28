import { HttpErrorResponse } from '@angular/common/http';

export function extractApiError(error: unknown, fallback = 'Something went wrong'): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  if (error.status === 0) {
    return 'The API could not be reached';
  }

  const message: unknown = error.error?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return typeof message === 'string' ? message : fallback;
}
