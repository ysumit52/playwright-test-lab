import {
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <dialog #dialog class="modal" [attr.aria-label]="heading()" (close)="closed.emit()">
      <div class="modal-body">
        <header class="modal-header">
          <h2>{{ heading() }}</h2>

          <button
            type="button"
            class="modal-close"
            aria-label="Close dialog"
            (click)="closed.emit()"
          >
            &times;
          </button>
        </header>

        <ng-content />
      </div>
    </dialog>
  `,
  styleUrl: './modal.scss',
})
export class Modal {
  readonly open = input(false);
  readonly heading = input('Dialog');
  readonly closed = output<void>();

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialogRef()?.nativeElement;

      if (!dialog) {
        return;
      }

      if (this.open() && !dialog.open) {
        dialog.showModal();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }
}
