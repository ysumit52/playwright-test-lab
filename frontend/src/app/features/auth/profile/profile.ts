import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { extractApiError } from '../../../core/api-error';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Breadcrumbs } from '../../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, RouterLink, Breadcrumbs],
  templateUrl: './profile.html',
})
export class Profile {
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly authService = inject(AuthService);
  readonly adminSecret = signal<string | null>(null);
  readonly adminError = signal<string | null>(null);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.info('Signed out');
        void this.router.navigate(['/auth/login']);
      },
    });
  }

  loadAdminSecret(): void {
    this.adminError.set(null);
    this.adminSecret.set(null);

    this.authService.adminArea().subscribe({
      next: (response) => this.adminSecret.set(response.secret),
      error: (error: unknown) =>
        this.adminError.set(extractApiError(error, 'Request failed')),
    });
  }
}
