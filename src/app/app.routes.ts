import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { EventsComponent } from '../events/events.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
  
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
{
    path: 'login',
    component: LoginComponent
},
{
    path: 'events',
    component: EventsComponent,
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
},
{
    path:'**',
    redirectTo: 'login',
    pathMatch: 'full'
}



];
