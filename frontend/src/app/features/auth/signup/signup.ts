import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  type ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { extractApiError } from '../../../core/api-error';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Breadcrumbs } from '../../../shared/breadcrumbs/breadcrumbs';
import type { UserRole } from '../../../core/models/api.models';

const passwordsMatch = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, Breadcrumbs],
  templateUrl: './signup.html',
})
export class Signup {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly pending = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly roles: UserRole[] = ['viewer', 'editor', 'admin'];

  readonly signupForm = new FormGroup(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      role: new FormControl<UserRole>('viewer', { nonNullable: true }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      acceptTerms: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: passwordsMatch },
  );

  isInvalid(name: keyof typeof this.signupForm.controls): boolean {
    const control = this.signupForm.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  get mismatch(): boolean {
    return (
      this.signupForm.hasError('passwordMismatch') &&
      this.signupForm.controls.confirmPassword.touched
    );
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password, role } = this.signupForm.getRawValue();
    this.pending.set(true);

    this.authService.signup({ fullName, email, password, role }).subscribe({
      next: (user) => {
        this.pending.set(false);
        this.toastService.success(`Account created for ${user.email}`);
        void this.router.navigate(['/auth/login'], {
          queryParams: { registered: user.email },
        });
      },
      error: (error: unknown) => {
        this.pending.set(false);
        this.errorMessage.set(extractApiError(error, 'Unable to create account'));
      },
    });
  }
}
