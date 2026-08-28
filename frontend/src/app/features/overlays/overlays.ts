import { Component, inject, signal } from '@angular/core';

import { ToastService } from '../../core/services/toast.service';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Modal } from '../../shared/modal/modal';

@Component({
  selector: 'app-overlays',
  imports: [Breadcrumbs, Modal],
  templateUrl: './overlays.html',
})
export class Overlays {
  readonly toastService = inject(ToastService);

  readonly modalOpen = signal(false);
  readonly nativeResult = signal<string | null>(null);
  readonly tooltipVisible = signal(false);

  openModal(): void {
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  triggerAlert(): void {
    alert('This is a native alert dialog.');
    this.nativeResult.set('alert dismissed');
  }

  triggerConfirm(): void {
    const accepted = confirm('Do you want to continue?');
    this.nativeResult.set(`confirm returned ${accepted}`);
  }

  triggerPrompt(): void {
    const value = prompt('What is your name?', 'Playwright');
    this.nativeResult.set(`prompt returned ${value ?? 'null'}`);
  }
}
