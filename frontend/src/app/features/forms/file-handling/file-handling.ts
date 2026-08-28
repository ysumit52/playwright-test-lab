import { Component, inject, signal } from '@angular/core';

import { extractApiError } from '../../../core/api-error';
import { FormsService } from '../../../core/services/forms.service';
import { ToastService } from '../../../core/services/toast.service';

export interface SelectedFile {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-file-handling',
  templateUrl: './file-handling.html',
})
export class FileHandling {
  private readonly formsService = inject(FormsService);
  private readonly toastService = inject(ToastService);

  private files: File[] = [];

  readonly selected = signal<SelectedFile[]>([]);
  readonly dragging = signal(false);
  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);
  readonly uploadResult = signal<string | null>(null);

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setFiles(Array.from(input.files ?? []));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.setFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  clear(): void {
    this.files = [];
    this.selected.set([]);
    this.uploadResult.set(null);
    this.uploadError.set(null);
  }

  upload(): void {
    if (this.files.length === 0) {
      this.uploadError.set('Select at least one file to upload');
      return;
    }

    this.uploadError.set(null);
    this.uploadResult.set(null);
    this.uploading.set(true);

    this.formsService.upload(this.files).subscribe({
      next: (response) => {
        this.uploading.set(false);
        this.uploadResult.set(response.message);
        this.toastService.success(response.message);
      },
      error: (error: unknown) => {
        this.uploading.set(false);
        this.uploadError.set(extractApiError(error, 'Upload failed'));
      },
    });
  }

  private setFiles(files: File[]): void {
    this.files = files;
    this.selected.set(
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
      })),
    );
    this.uploadResult.set(null);
    this.uploadError.set(null);
  }
}
