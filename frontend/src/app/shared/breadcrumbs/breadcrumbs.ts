import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  template: `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        @for (crumb of crumbs(); track crumb.label; let last = $last) {
          <li>
            @if (crumb.link && !last) {
              <a [routerLink]="crumb.link">{{ crumb.label }}</a>
            } @else {
              <span aria-current="page">{{ crumb.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .breadcrumbs ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0;
      margin: 0 0 1rem;
      font-size: 0.875rem;
      list-style: none;
    }

    .breadcrumbs li + li::before {
      margin-right: 0.5rem;
      color: #6b7794;
      content: '/';
    }

    .breadcrumbs [aria-current='page'] {
      font-weight: 700;
    }
  `,
})
export class Breadcrumbs {
  readonly crumbs = input.required<Crumb[]>();
}
