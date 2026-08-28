import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { extractApiError } from '../../../core/api-error';
import { FormsService } from '../../../core/services/forms.service';
import { ToastService } from '../../../core/services/toast.service';

const INTERESTS = ['automation', 'accessibility', 'performance', 'security'];

@Component({
  selector: 'app-kitchen-sink-form',
  imports: [ReactiveFormsModule],
  templateUrl: './kitchen-sink-form.html',
})
export class KitchenSinkForm {
  private readonly formsService = inject(FormsService);
  private readonly toastService = inject(ToastService);

  readonly interests = INTERESTS;
  readonly pending = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly result = signal<string | null>(null);

  readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^\+?[0-9 ()-]{7,20}$/)],
    }),
    website: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^https?:\/\/.+/)],
    }),
    age: new FormControl(30, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(18), Validators.max(120)],
    }),
    startDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plan: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contactMethod: new FormControl('email', { nonNullable: true }),
    interests: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    satisfaction: new FormControl(5, { nonNullable: true }),
    favouriteColour: new FormControl('#2745b8', { nonNullable: true }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)],
    }),
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  isInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  isInterestChecked(interest: string): boolean {
    return this.form.controls.interests.value.includes(interest);
  }

  toggleInterest(interest: string, checked: boolean): void {
    const control = this.form.controls.interests;
    const next = checked
      ? [...control.value, interest]
      : control.value.filter((item) => item !== interest);

    control.setValue(next);
    control.markAsDirty();
  }

  reset(): void {
    this.form.reset();
    this.result.set(null);
    this.serverError.set(null);
  }

  submit(): void {
    this.serverError.set(null);
    this.result.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { favouriteColour, ...payload } = this.form.getRawValue();
    this.pending.set(true);

    this.formsService
      .submitContact({ ...payload, colour: favouriteColour })
      .subscribe({
        next: (response) => {
          this.pending.set(false);
          this.result.set(response.message);
          this.toastService.success('Contact form submitted');
        },
        error: (error: unknown) => {
          this.pending.set(false);
          this.serverError.set(extractApiError(error, 'Submission failed'));
        },
      });
  }
}
