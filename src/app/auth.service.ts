import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

/**
 * Thin wrapper around angular-auth-oidc-client for Amazon Cognito (Hosted UI).
 *
 * Auth model: redirect-based Authorization Code + PKCE flow. There is no
 * username/password handled in this app anymore -- the Cognito Hosted UI owns
 * credentials. `login()` redirects to the Hosted UI; on return,
 * `OidcSecurityService.checkAuth()` (called once in AppComponent) processes the
 * callback and populates the session.
 *
 * The ID token is what we send to api.junioreconomicclub.org (it carries the
 * `email` and `custom:chapter` claims the backend relies on).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidc = inject(OidcSecurityService);

  /** Redirect to the Cognito Hosted UI login page. */
  login(): void {
    this.oidc.authorize();
  }

  /** Sign out of Cognito and clear the local session. */
  logout(): void {
    this.oidc.logoff().subscribe();
    localStorage.removeItem('userId');
    localStorage.removeItem('chapter');
  }

  /** Emits true once the user has a valid Cognito session. */
  get isAuthenticated$(): Observable<boolean> {
    return this.oidc.isAuthenticated$.pipe(map((r) => r.isAuthenticated));
  }

  /** Fresh ID token for the Authorization: Bearer header. */
  getIdToken(): Observable<string> {
    return this.oidc.getIdToken();
  }

  /** The Cognito user `sub`. */
  get userId(): string {
    return localStorage.getItem('userId') ?? '';
  }

  /** The member's chapter, read from the `custom:chapter` token claim. */
  get chapter(): string {
    return localStorage.getItem('chapter') ?? '';
  }

  /**
   * Persist the identifiers other components read from localStorage. Called
   * after a successful checkAuth() with the decoded ID-token claims (userData).
   */
  persistClaims(userData: any): void {
    if (!userData) {
      return;
    }
    localStorage.setItem('userId', userData.sub ?? '');
    localStorage.setItem('chapter', userData['custom:chapter'] ?? '');
  }
}
