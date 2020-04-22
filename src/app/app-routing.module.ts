import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdderrorComponent } from './adderror/adderror.component';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LoginComponent } from './user/login/login.component';

import { AuthGaurd } from './auth-guard.guard';

const routes: Routes = [

  { path: '', component: DashboardComponent , pathMatch: 'full', canActivate: [ AuthGaurd ] },
  { path: 'adderror', component: AdderrorComponent , canActivate: [ AuthGaurd ] },
  { path: 'error', component: ErrorComponent , canActivate: [ AuthGaurd ] },

  { path: 'profile', component: ProfileComponent , canActivate: [ AuthGaurd ] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
