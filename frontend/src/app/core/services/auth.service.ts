import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap, type Observable } from 'rxjs';

import type { AuthUser, LoginResponse, UserRole } from '../models/api.models';

const TOKEN_STORAGE_KEY = 'lab_access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly currentUser = signal<AuthUser | null>(null);
  private readonly sessionChecked = signal(false);

  readonly user = this.currentUser.asReadonly();
  readonly checked = this.sessionChecked.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly role = computed<UserRole | null>(() => this.currentUser()?.role ?? null);

  get accessToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  signup(payload: {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
  }): Observable<AuthUser> {
    return this.http.post<AuthUser>('/api/auth/signup', payload);
  }

  login(payload: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', payload, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.storeToken(response.accessToken);
          this.currentUser.set(response.user);
          this.sessionChecked.set(true);
        }),
      );
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>('/api/auth/logout', {}, { withCredentials: true })
      .pipe(tap(() => this.clearSession()));
  }

  forgotPassword(email: string): Observable<{ message: string; resetToken: string | null }> {
    return this.http.post<{ message: string; resetToken: string | null }>(
      '/api/auth/forgot-password',
      { email },
    );
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/reset-password', {
      token,
      password,
    });
  }

  adminArea(): Observable<{ message: string; secret: string }> {
    return this.http.get<{ message: string; secret: string }>(
      '/api/auth/admin-area',
      { withCredentials: true },
    );
  }

  // Rehydrates the session from the httpOnly cookie or stored bearer token.
  restoreSession(): Observable<AuthUser | null> {
    return this.http
      .get<AuthUser>('/api/auth/me', { withCredentials: true })
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
          this.sessionChecked.set(true);
        }),
        catchError(() => {
          this.clearSession();
          this.sessionChecked.set(true);
          return of(null);
        }),
      );
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this.role();
    return role !== null && roles.includes(role);
  }

  private storeToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  private clearSession(): void {
    this.currentUser.set(null);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
}
