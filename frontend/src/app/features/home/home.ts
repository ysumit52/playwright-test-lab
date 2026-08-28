import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';

import { ApiHealthService } from '../../core/services/api-health.service';
import { TestData } from '../test-data/test-data';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, RouterLink, TestData],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly apiHealthService = inject(ApiHealthService);

  readonly features = [
    {
      link: '/auth/login',
      title: 'Authentication',
      description:
        'Login, signup, password reset, role-based access and session persistence.',
    },
    {
      link: '/products',
      title: 'Products CRUD',
      description:
        'Sortable and filterable table, pagination, modals and bulk actions.',
    },
    {
      link: '/forms',
      title: 'Forms',
      description:
        'Every input type, validation messages, a wizard and file upload.',
    },
    {
      link: '/async',
      title: 'Async & dynamic',
      description:
        'Debounced search, infinite scroll, server-sent events and slow requests.',
    },
    {
      link: '/overlays',
      title: 'Overlays',
      description: 'Modals, native alert/confirm/prompt, tooltips and toasts.',
    },
    {
      link: '/frames',
      title: 'Frames & windows',
      description: 'Embedded and nested iframes plus new-tab flows.',
    },
    {
      link: '/edge-cases',
      title: 'Edge cases',
      description:
        'Slow rendering, conditional visibility and disabled to enabled states.',
    },
  ];

  readonly health$ = this.apiHealthService.getHealth().pipe(
    map((health) => ({
      loading: false,
      error: false,
      health,
    })),
    startWith({
      loading: true,
      error: false,
      health: null,
    }),
    catchError(() =>
      of({
        loading: false,
        error: true,
        health: null,
      }),
    ),
  );
}
