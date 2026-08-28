import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { extractApiError } from '../../../core/api-error';
import { AuthService } from '../../../core/services/auth.service';
import { Breadcrumbs } from '../../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, Breadcrumbs],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);

  readonly pending = signal(false);
  readonly message = signal<string | null>(null);
  readonly resetToken = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  get emailInvalid(): boolean {
    const control = this.form.controls.email;
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    this.message.set(null);
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.pending.set(true);

    this.authService.forgotPassword(this.form.controls.email.value).subscribe({
      next: (response) => {
        this.pending.set(false);
        this.message.set(response.message);
        this.resetToken.set(response.resetToken);
      },
      error: (error: unknown) => {
        this.pending.set(false);
        this.errorMessage.set(extractApiError(error));
      },
    });
  }
}
