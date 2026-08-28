import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { extractApiError } from '../../core/api-error';
import { AsyncContentService } from '../../core/services/async-content.service';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

interface FeedItem {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-async-content',
  imports: [ReactiveFormsModule, Breadcrumbs],
  templateUrl: './async-content.html',
})
export class AsyncContent {
  private readonly asyncService = inject(AsyncContentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly searching = signal(false);
  readonly searchResults = signal<string[]>([]);
  readonly searchRequestCount = signal(0);

  readonly feedItems = signal<FeedItem[]>([]);
  readonly feedCursor = signal<number | null>(0);
  readonly feedLoading = signal(false);

  readonly ticks = signal<{ tick: number; timestamp: string }[]>([]);
  readonly streaming = signal(false);

  readonly slowPending = signal(false);
  readonly slowResult = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  private eventSource: EventSource | null = null;

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          this.searching.set(true);
          this.searchRequestCount.update((count) => count + 1);
          return this.asyncService.search(term);
        }),
      )
      .subscribe({
        next: (response) => {
          this.searching.set(false);
          this.searchResults.set(response.results);
        },
        error: (error: unknown) => {
          this.searching.set(false);
          this.errorMessage.set(extractApiError(error));
        },
      });

    this.loadMore();

    this.destroyRef.onDestroy(() => this.stopStream());
  }

  loadMore(): void {
    const cursor = this.feedCursor();

    if (cursor === null || this.feedLoading()) {
      return;
    }

    this.feedLoading.set(true);

    this.asyncService.feed(cursor).subscribe({
      next: (page) => {
        this.feedItems.update((items) => [...items, ...page.items]);
        this.feedCursor.set(page.nextCursor);
        this.feedLoading.set(false);
      },
      error: (error: unknown) => {
        this.feedLoading.set(false);
        this.errorMessage.set(extractApiError(error));
      },
    });
  }

  // Infinite scroll: fetch the next page when the sentinel nears the viewport.
  onFeedScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const nearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 80;

    if (nearBottom) {
      this.loadMore();
    }
  }

  toggleStream(): void {
    if (this.streaming()) {
      this.stopStream();
      return;
    }

    if (typeof EventSource === 'undefined') {
      return;
    }

    this.eventSource = new EventSource('/api/async/ticker');
    this.streaming.set(true);

    this.eventSource.onmessage = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as { tick: number; timestamp: string };
      this.ticks.update((current) => [payload, ...current].slice(0, 10));
    };

    this.eventSource.onerror = () => this.stopStream();
  }

  stopStream(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.streaming.set(false);
  }

  runSlowRequest(): void {
    this.slowResult.set(null);
    this.slowPending.set(true);

    this.asyncService.slow(3000).subscribe({
      next: (response) => {
        this.slowPending.set(false);
        this.slowResult.set(response.message);
      },
      error: (error: unknown) => {
        this.slowPending.set(false);
        this.errorMessage.set(extractApiError(error));
      },
    });
  }
}
