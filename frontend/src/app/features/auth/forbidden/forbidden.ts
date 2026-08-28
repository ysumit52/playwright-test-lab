import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink],
  template: `
    <h1 class="page-title">403 — Access denied</h1>

    <div class="alert alert-error" role="alert" data-testid="forbidden">
      <p>
        You do not have permission to view
        <code>{{ from }}</code>.
      </p>

      <p>Required role: <strong data-testid="required-role">{{ required }}</strong></p>
    </div>

    <p class="row" style="margin-top: 1.5rem">
      <a class="btn" routerLink="/">Back to home</a>
      <a class="btn" routerLink="/profile">Go to profile</a>
    </p>
  `,
})
export class Forbidden {
  private readonly route = inject(ActivatedRoute);

  readonly required = this.route.snapshot.queryParamMap.get('required') ?? 'unknown';
  readonly from = this.route.snapshot.queryParamMap.get('from') ?? '/';
}
