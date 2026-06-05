import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'memberConnect';
  public displayName: string = '';
  showHead: boolean = false;

  private authService = inject(AuthService);
  private oidc = inject(OidcSecurityService);
  private http = inject(HttpClient);

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url === '/' ||
          event.url.includes('/login') ||
          event.url.includes('/register')
        ) {
          this.showHead = false;
        } else {
          this.showHead = true;
        }
      }
    });
  }

  ngOnInit(): void {
    // Processes the Hosted UI redirect callback (?code=...) on app load and
    // restores an existing session on subsequent loads.
    this.oidc.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      if (!isAuthenticated) {
        return;
      }
      // Persist sub + custom:chapter so the rest of the app can read them.
      this.authService.persistClaims(userData);
      this.loadMemberName();
    });
  }

  /** Replaces the former Firestore profile read. */
  private loadMemberName(): void {
    this.authService.getIdToken().subscribe((token) => {
      if (!token) {
        return;
      }
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      const url = `https://api.junioreconomicclub.org/account/retrieveDetails?chapter=${this.authService.chapter}`;
      this.http.get<any>(url, { headers }).subscribe({
        next: (member) => {
          this.displayName = member?.firstName ?? '';
        },
        error: () => {
          this.displayName = '';
        },
      });
    });
  }
}
