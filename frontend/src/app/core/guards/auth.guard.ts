import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models/api.models';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const redirect = () =>
    router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });

  if (authService.isAuthenticated()) {
    return true;
  }

  return authService
    .restoreSession()
    .pipe(map((user) => (user ? true : redirect())));
};

export const roleGuard = (...roles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const decide = () =>
      authService.hasRole(...roles)
        ? true
        : router.createUrlTree(['/auth/forbidden'], {
            queryParams: { required: roles.join(','), from: state.url },
          });

    if (authService.isAuthenticated()) {
      return decide();
    }

    return authService.restoreSession().pipe(
      map((user) =>
        user
          ? decide()
          : router.createUrlTree(['/auth/login'], {
              queryParams: { returnUrl: state.url },
            }),
      ),
    );
  };
};
