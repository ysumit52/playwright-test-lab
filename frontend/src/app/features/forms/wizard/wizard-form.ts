import { KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { extractApiError } from '../../../core/api-error';
import { FormsService } from '../../../core/services/forms.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-wizard-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './wizard-form.html',
})
export class WizardForm {
  private readonly formsService = inject(FormsService);
  private readonly toastService = inject(ToastService);

  readonly steps = ['Your details', 'Company', 'Plan', 'Review'];
  readonly step = signal(0);
  readonly pending = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly completed = signal<string | null>(null);

  readonly detailsGroup = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  readonly companyGroup = new FormGroup({
    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    companySize: new FormControl('1-10', { nonNullable: true }),
  });

  readonly planGroup = new FormGroup({
    plan: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    billingCycle: new FormControl('monthly', { nonNullable: true }),
  });

  readonly reviewGroup = new FormGroup({
    confirm: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  private get groups(): FormGroup[] {
    return [this.detailsGroup, this.companyGroup, this.planGroup, this.reviewGroup];
  }

  get currentGroup(): FormGroup {
    return this.groups[this.step()];
  }

  get canAdvance(): boolean {
    return this.currentGroup.valid;
  }

  get summary(): Record<string, unknown> {
    return {
      ...this.detailsGroup.getRawValue(),
      ...this.companyGroup.getRawValue(),
      ...this.planGroup.getRawValue(),
    };
  }

  isInvalid(group: FormGroup, name: string): boolean {
    const control = group.get(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  next(): void {
    if (this.currentGroup.invalid) {
      this.currentGroup.markAllAsTouched();
      return;
    }

    this.step.update((value) => Math.min(value + 1, this.steps.length - 1));
  }

  previous(): void {
    this.step.update((value) => Math.max(value - 1, 0));
  }

  submit(): void {
    this.serverError.set(null);

    if (this.reviewGroup.invalid) {
      this.reviewGroup.markAllAsTouched();
      return;
    }

    this.pending.set(true);

    this.formsService
      .submitWizard({ ...this.summary, ...this.reviewGroup.getRawValue() })
      .subscribe({
        next: (response) => {
          this.pending.set(false);
          this.completed.set(response.message);
          this.toastService.success('Wizard completed');
        },
        error: (error: unknown) => {
          this.pending.set(false);
          this.serverError.set(extractApiError(error, 'Submission failed'));
        },
      });
  }

  restart(): void {
    this.completed.set(null);
    this.serverError.set(null);
    this.step.set(0);

    for (const group of this.groups) {
      group.reset();
    }

    this.companyGroup.controls.companySize.setValue('1-10');
    this.planGroup.controls.billingCycle.setValue('monthly');
  }
}
