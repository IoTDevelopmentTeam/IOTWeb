import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device/device.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import { UserUpdateComponent } from './user-update/user-update.component';

const routes: Routes = [
  { path: 'login',component: LoginComponent },
  {path: '',  pathMatch: 'full',  redirectTo: 'login'},
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'device', component: DeviceComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'admindashboard', component: AdminDashboardComponent },
  { path: 'forgetpassword', component:ForgotPasswordComponent},
  // {path:'updateuser',component: UserUpdateComponent},
 
  {
    path: 'dashboard',
    component: DeviceComponent,
    children: [
      { path: '', component: DashboardComponent },
    ]
  },
  {
    path: 'updateuser',
    component: DeviceComponent,
    children: [
      { path: '', component: UserUpdateComponent },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
