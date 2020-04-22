
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, NgForm} from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router'; 
import { User } from 'src/app/app';

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  isLoading;
  error;
  emailid ;
  password : string;
  user: User;
  constructor(private authService: AuthService,private router: Router){
    if(this.authService.isLoggedIn == true) {
      this.router.navigate(['/'])
    }
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit(signinForm: NgForm) {

    if (!signinForm.valid) {
      return;
    }

    this.isLoading = true;
    this.authService.signInWithEmailAndPassword(this.emailid, this.password);
    this.isLoading = false;

    signinForm.reset();
  }

  async openBrowser() {
    await Browser.open({ url: "https://smazee.com" });
  }
}
