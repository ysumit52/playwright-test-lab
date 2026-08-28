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
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Breadcrumbs],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);
  readonly pending = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  isInvalid(control: 'email' | 'password'): boolean {
    const field = this.loginForm.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }

  login(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.pending.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.pending.set(false);
        this.toastService.success(`Signed in as ${response.user.fullName}`);

        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') ?? '/profile';

        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: unknown) => {
        this.pending.set(false);
        this.errorMessage.set(extractApiError(error, 'Unable to sign in'));
      },
    });
  }
}