import { Routes } from '@angular/router';

import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home').then((module) => module.Home),
    title: 'Playwright Test Lab',
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login').then((module) => module.Login),
    title: 'Sign in | Playwright Test Lab',
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./features/auth/signup/signup').then((module) => module.Signup),
    title: 'Create account | Playwright Test Lab',
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then(
        (module) => module.ForgotPassword,
      ),
    title: 'Forgot password | Playwright Test Lab',
  },
  {
    path: 'auth/reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then(
        (module) => module.ResetPassword,
      ),
    title: 'Reset password | Playwright Test Lab',
  },
  {
    path: 'auth/forbidden',
    loadComponent: () =>
      import('./features/auth/forbidden/forbidden').then(
        (module) => module.Forbidden,
      ),
    title: 'Access denied | Playwright Test Lab',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/profile/profile').then((module) => module.Profile),
    title: 'Profile | Playwright Test Lab',
  },
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    loadComponent: () =>
      import('./features/auth/profile/profile').then((module) => module.Profile),
    title: 'Admin | Playwright Test Lab',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products').then((module) => module.Products),
    title: 'Products | Playwright Test Lab',
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./features/forms/forms').then((module) => module.Forms),
    title: 'Forms | Playwright Test Lab',
  },
  {
    path: 'async',
    loadComponent: () =>
      import('./features/async-content/async-content').then(
        (module) => module.AsyncContent,
      ),
    title: 'Async & dynamic | Playwright Test Lab',
  },
  {
    path: 'overlays',
    loadComponent: () =>
      import('./features/overlays/overlays').then((module) => module.Overlays),
    title: 'Overlays | Playwright Test Lab',
  },
  {
    path: 'frames',
    loadComponent: () =>
      import('./features/frames/frames').then((module) => module.Frames),
    title: 'Frames & windows | Playwright Test Lab',
  },
  {
    path: 'edge-cases',
    loadComponent: () =>
      import('./features/edge-cases/edge-cases').then(
        (module) => module.EdgeCases,
      ),
    title: 'Edge cases | Playwright Test Lab',
  },
  {
    path: 'legacy-products',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found').then(
        (module) => module.NotFound,
      ),
    title: 'Page not found | Playwright Test Lab',
  },
];