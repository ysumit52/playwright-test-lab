import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-edge-cases',
  imports: [Breadcrumbs],
  templateUrl: './edge-cases.html',
})
export class EdgeCases {
  private readonly destroyRef = inject(DestroyRef);
  private timers: ReturnType<typeof setTimeout>[] = [];

  readonly slowElementVisible = signal(false);
  readonly slowCountdown = signal(0);

  readonly buttonEnabled = signal(false);
  readonly conditionalVisible = signal(false);
  readonly detached = signal(false);

  readonly agreeChecked = signal(false);
  readonly typedName = signal('');

  readonly clickCount = signal(0);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimers());
  }

  get submitEnabled(): boolean {
    return this.agreeChecked() && this.typedName().trim().length >= 3;
  }

  startSlowRender(): void {
    this.clearTimers();
    this.slowElementVisible.set(false);
    this.slowCountdown.set(3);

    for (let second = 1; second <= 3; second++) {
      this.timers.push(
        setTimeout(() => this.slowCountdown.set(3 - second), second * 1000),
      );
    }

    this.timers.push(setTimeout(() => this.slowElementVisible.set(true), 3000));
  }

  enableAfterDelay(): void {
    this.buttonEnabled.set(false);
    this.timers.push(setTimeout(() => this.buttonEnabled.set(true), 2000));
  }

  toggleConditional(): void {
    this.conditionalVisible.set(!this.conditionalVisible());
  }

  detachElement(): void {
    this.detached.set(true);
    this.timers.push(setTimeout(() => this.detached.set(false), 2000));
  }

  onNameInput(event: Event): void {
    this.typedName.set((event.target as HTMLInputElement).value);
  }

  private clearTimers(): void {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }

    this.timers = [];
  }
}
