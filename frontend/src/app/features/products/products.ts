import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { extractApiError } from '../../core/api-error';
import type { Product, ProductPage, ProductStatus } from '../../core/models/api.models';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Modal } from '../../shared/modal/modal';

const SORTABLE = ['name', 'sku', 'category', 'price', 'stock', 'status'] as const;
export type SortField = (typeof SORTABLE)[number];

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, RouterLink, Breadcrumbs, Modal],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);

  readonly authService = inject(AuthService);

  readonly sortableColumns = SORTABLE;
  readonly categories = signal<string[]>([]);
  readonly statuses: ProductStatus[] = ['draft', 'active', 'archived'];

  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly page = signal<ProductPage | null>(null);
  readonly selectedIds = signal<Set<string>>(new Set());

  readonly sortBy = signal<SortField | 'createdAt'>('createdAt');
  readonly sortDir = signal<'asc' | 'desc'>('desc');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly categoryFilter = signal('');
  readonly statusFilter = signal('');
  readonly slowMode = signal(false);

  readonly editing = signal<Product | null>(null);
  readonly formOpen = signal(false);
  readonly formError = signal<string | null>(null);
  readonly saving = signal(false);

  readonly confirmTarget = signal<Product | null>(null);
  readonly confirmBulk = signal(false);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    sku: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', { nonNullable: true }),
    category: new FormControl('Electronics', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    status: new FormControl<ProductStatus>('draft', { nonNullable: true }),
    featured: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    this.productService.categories().subscribe({
      next: (response) => this.categories.set(response.categories),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage.set(1);
        this.load();
      });
    this.load();
  }

  get canWrite(): boolean {
    return this.authService.hasRole('admin', 'editor');
  }

  get canDelete(): boolean {
    return this.authService.hasRole('admin');
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.productService
      .list({
        search: this.searchControl.value,
        category: this.categoryFilter() || undefined,
        status: (this.statusFilter() || undefined) as ProductStatus | undefined,
        sortBy: this.sortBy(),
        sortDir: this.sortDir(),
        page: this.currentPage(),
        pageSize: this.pageSize(),
        delayMs: this.slowMode() ? 2000 : 0,
      })
      .subscribe({
        next: (page) => {
          this.page.set(page);
          this.selectedIds.set(new Set());
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.loading.set(false);
          this.loadError.set(extractApiError(error, 'Unable to load products'));
        },
      });
  }

  sort(field: SortField): void {
    if (this.sortBy() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDir.set('asc');
    }

    this.currentPage.set(1);
    this.load();
  }

  ariaSort(field: SortField): 'ascending' | 'descending' | 'none' {
    if (this.sortBy() !== field) {
      return 'none';
    }

    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  setFilter(kind: 'category' | 'status', value: string): void {
    if (kind === 'category') {
      this.categoryFilter.set(value);
    } else {
      this.statusFilter.set(value);
    }

    this.currentPage.set(1);
    this.load();
  }

  setPageSize(value: string): void {
    this.pageSize.set(Number(value));
    this.currentPage.set(1);
    this.load();
  }

  goToPage(page: number): void {
    const total = this.page()?.totalPages ?? 1;

    if (page < 1 || page > total) {
      return;
    }

    this.currentPage.set(page);
    this.load();
  }

  clearFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.categoryFilter.set('');
    this.statusFilter.set('');
    this.currentPage.set(1);
    this.load();
  }

  toggleSlowMode(): void {
    this.slowMode.set(!this.slowMode());
    this.load();
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelection(id: string): void {
    this.selectedIds.update((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  get allSelected(): boolean {
    const items = this.page()?.items ?? [];
    return items.length > 0 && items.every((item) => this.isSelected(item.id));
  }

  toggleSelectAll(): void {
    const items = this.page()?.items ?? [];
    this.selectedIds.set(
      this.allSelected ? new Set() : new Set(items.map((item) => item.id)),
    );
  }

  openCreate(): void {
    this.editing.set(null);
    this.formError.set(null);
    this.productForm.reset({
      name: '',
      sku: '',
      description: '',
      category: this.categories()[0] ?? 'Electronics',
      price: 0,
      stock: 0,
      status: 'draft',
      featured: false,
    });
    this.formOpen.set(true);
  }

  openEdit(product: Product): void {
    this.editing.set(product);
    this.formError.set(null);
    this.productForm.setValue({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      featured: product.featured,
    });
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  isFormFieldInvalid(name: keyof typeof this.productForm.controls): boolean {
    const control = this.productForm.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  save(): void {
    this.formError.set(null);

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.productForm.getRawValue();
    const editing = this.editing();
    this.saving.set(true);

    const request = editing
      ? this.productService.update(editing.id, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: (product) => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.toastService.success(
          editing ? `Updated ${product.name}` : `Created ${product.name}`,
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.formError.set(extractApiError(error, 'Unable to save product'));
      },
    });
  }

  askDelete(product: Product): void {
    this.confirmBulk.set(false);
    this.confirmTarget.set(product);
  }

  askBulkDelete(): void {
    this.confirmTarget.set(null);
    this.confirmBulk.set(true);
  }

  cancelConfirm(): void {
    this.confirmTarget.set(null);
    this.confirmBulk.set(false);
  }

  confirmDelete(): void {
    const target = this.confirmTarget();

    if (target) {
      this.productService.remove(target.id).subscribe({
        next: () => {
          this.toastService.success(`Deleted ${target.name}`);
          this.cancelConfirm();
          this.load();
        },
        error: (error: unknown) => {
          this.toastService.error(extractApiError(error, 'Unable to delete'));
          this.cancelConfirm();
        },
      });

      return;
    }

    const ids = [...this.selectedIds()];

    this.productService.bulkRemove(ids).subscribe({
      next: (result) => {
        this.toastService.success(`Deleted ${result.deleted} product(s)`);
        this.cancelConfirm();
        this.load();
      },
      error: (error: unknown) => {
        this.toastService.error(extractApiError(error, 'Bulk delete failed'));
        this.cancelConfirm();
      },
    });
  }

  bulkStatus(status: string): void {
    if (!status) {
      return;
    }

    const ids = [...this.selectedIds()];

    this.productService.bulkUpdateStatus(ids, status as ProductStatus).subscribe({
      next: (result) => {
        this.toastService.success(`Updated ${result.updated} product(s)`);
        this.load();
      },
      error: (error: unknown) =>
        this.toastService.error(extractApiError(error, 'Bulk update failed')),
    });
  }
}
