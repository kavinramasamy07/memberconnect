import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { EventsComponent } from '../events/events.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { RegisterComponent } from '../register/register.component';
import { OpportunitiesComponent } from '../opportunities/opportunities.component';
  
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
{
    path: 'login',
    component: LoginComponent
},
{
    path: 'register',
    component: RegisterComponent
},
{
    path: 'events',
    component: EventsComponent,
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
},
{
    path: 'opportunities',
    component: OpportunitiesComponent,
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
},
{
    path:'**',
    redirectTo: 'login',
    pathMatch: 'full'
}



];
