import { Component, inject, signal } from '@angular/core';

import { extractApiError } from '../../core/api-error';
import { TestSupportService, type ResetResult } from '../../core/services/test-support.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-test-data',
  templateUrl: './test-data.html',
})
export class TestData {
  private readonly testSupportService = inject(TestSupportService);
  private readonly toastService = inject(ToastService);

  readonly state = signal<{ users: number; products: number; submissions: number } | null>(null);
  readonly lastReset = signal<ResetResult | null>(null);
  readonly pending = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.testSupportService.state().subscribe({
      next: (state) => this.state.set(state),
      error: (error: unknown) => this.errorMessage.set(extractApiError(error)),
    });
  }

  reset(): void {
    this.pending.set(true);
    this.errorMessage.set(null);

    this.testSupportService.reset().subscribe({
      next: (result) => {
        this.pending.set(false);
        this.lastReset.set(result);
        this.toastService.success('Test data reset');
        this.refresh();
      },
      error: (error: unknown) => {
        this.pending.set(false);
        this.errorMessage.set(extractApiError(error, 'Reset failed'));
      },
    });
  }
}
