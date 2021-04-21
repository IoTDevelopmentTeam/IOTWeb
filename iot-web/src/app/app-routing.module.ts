import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device/device.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VideoComponent } from './videos/video.component';

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
    path: 'device',
    component: DeviceComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
    ]
  },
  {
    path: 'device',
    component: DeviceComponent,
    children: [
      { path: 'updateuser', component: UserUpdateComponent },
    ]
  },
  {
    path: 'device',
    component: DeviceComponent,
    children: [
      { path: 'changepassword', component: ChangePasswordComponent },
    ]
  },
  {
    path: 'device',
    component: DeviceComponent,
    children: [
      { path: 'videos', component: VideoComponent },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
