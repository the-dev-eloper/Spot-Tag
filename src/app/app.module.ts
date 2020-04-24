import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error/error.component';
import { AdderrorComponent } from './error/adderror/adderror.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { SignupComponent } from './user/signup/signup.component';
import { EditerrorComponent } from './error/editerror/editerror.component';
import { PhoneloginComponent, VerifyDialog } from './user/phonelogin/phonelogin.component';

import { AuthService } from './auth.service';
import { DynamicScriptLoaderService } from './dynamic-script-loader.service';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdderrorComponent,
    ErrorComponent,
    LoginComponent,
    ProfileComponent,
    SignupComponent,
    EditerrorComponent,
    PhoneloginComponent,
    VerifyDialog
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    DynamicScriptLoaderService
  ],
  bootstrap: [AppComponent],
  entryComponents: [VerifyDialog]
})
export class AppModule { }
