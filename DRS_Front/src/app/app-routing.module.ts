// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AdminGeneralComponent } from './admin-general/admin-general.component';
import { UserSecondWelcomeComponent } from './user-second-welcome/user-second-welcome.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'admin-general', component: AdminGeneralComponent },
  { path: 'user-second-welcome', component: UserSecondWelcomeComponent },
  { path: 'logout', component: LogoutComponent }, // Assuming you want a separate route for logout
  { path: '**', redirectTo: '' } // Catch-all route, redirect to welcome page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
