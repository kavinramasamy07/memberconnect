import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { EventsComponent } from '../events/events.component';
import { OpportunitiesComponent } from '../opportunities/opportunities.component';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: 'opportunities',
    component: OpportunitiesComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
