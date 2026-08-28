import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { ToastHost } from './shared/toast-host/toast-host';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastHost],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly authService = inject(AuthService);

  readonly links = [
    { path: '/products', label: 'Products' },
    { path: '/forms', label: 'Forms' },
    { path: '/async', label: 'Async' },
    { path: '/overlays', label: 'Overlays' },
    { path: '/frames', label: 'Frames' },
    { path: '/edge-cases', label: 'Edge cases' },
  ];

  constructor() {
    this.authService.restoreSession().subscribe();
  }
}