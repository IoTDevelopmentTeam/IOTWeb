import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { DeviceComponent } from './device/device.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from  '@angular/common/http';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DeviceComponent,
    LoginComponent,
    UserRegistrationComponent,
    AdminDashboardComponent,
    ForgotPasswordComponent,
    UserUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    HttpClientModule//,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyB45fOlHe5a7PKBGPqm32FP81WbEFXBlGY'
    // })
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
