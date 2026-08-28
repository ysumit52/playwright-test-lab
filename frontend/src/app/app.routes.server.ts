import { RenderMode, ServerRoute } from '@angular/ssr';

// Health check hits a relative /api URL, so render in the browser instead of prerendering.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
