import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { extractApiError } from '../../../core/api-error';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Breadcrumbs } from '../../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, Breadcrumbs],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly pending = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    token: new FormControl(
      this.route.snapshot.queryParamMap.get('token') ?? '',
      { nonNullable: true, validators: [Validators.required] },
    ),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  isInvalid(name: 'token' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { token, password } = this.form.getRawValue();
    this.pending.set(true);

    this.authService.resetPassword(token, password).subscribe({
      next: (response) => {
        this.pending.set(false);
        this.toastService.success(response.message);
        void this.router.navigate(['/auth/login']);
      },
      error: (error: unknown) => {
        this.pending.set(false);
        this.errorMessage.set(extractApiError(error, 'Unable to reset password'));
      },
    });
  }
}
