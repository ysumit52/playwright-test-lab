import { Component, inject } from '@angular/core';

import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    <div class="toast-host" role="region" aria-label="Notifications">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast toast-' + toast.kind"
          [attr.data-testid]="'toast-' + toast.kind"
          [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
          aria-live="polite"
        >
          <span class="toast-message">{{ toast.message }}</span>

          <button
            type="button"
            class="toast-close"
            [attr.aria-label]="'Dismiss notification: ' + toast.message"
            (click)="toastService.dismiss(toast.id)"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-host.scss',
})
export class ToastHost {
  readonly toastService = inject(ToastService);
}
