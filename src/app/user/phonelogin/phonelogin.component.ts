
import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, Validators, NgForm} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router'; 
import { User } from 'src/app/app';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase';
const { Browser } = Plugins;

@Component({
  selector: 'app-phonelogin',
  templateUrl: './phonelogin.component.html',
  styleUrls: ['./phonelogin.component.scss']
})
export class PhoneloginComponent implements OnInit {

  phone = new FormControl('+91', [Validators.required]);
  hide = true;
  isLoading:boolean = false;
  otpsent: boolean = false;
  phoneno = '+91' ;
  password : string;
  user: User;
  windowRef: any;
  verificationCode: number;
  phoneuid:any;
  uemail: string;
  upass: string;
  constructor(private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
    ){
    if(this.authService.isLoggedIn == true) {
      this.router.navigate(['/'])
    }
  }
  ngOnInit() {
    this.windowRef = this.authService.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    this.windowRef.recaptchaVerifier.render()

  }
  async confirmSignin(){
    const dialogRef = this.dialog.open(VerifyDialog,{
      data:{email:'',pass:''}
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      const companyid = await this.authService.signinforPhoneuid(result.email, result.pass);
      console.log(companyid);
      if(companyid){
        this.authService.setPhoneCompany(companyid,this.phoneuid)
      }
    });
  }
  verifyLoginCode() {

    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then( async result => {
        this.user = result.user;
        console.log(this.user);
        this.phoneuid = await this.authService.setUserdataforPhone(this.user)
        console.log(this.phoneuid); 
        if(this.phoneuid)this.confirmSignin();
      })
    .catch( error => console.log(error, 'Incorrect code entered?'));
  }
  getErrorMessage() {
    if (this.phone.hasError('required')) {
      return 'You must enter a value';
    }

    return this.phone.hasError('phone') ? 'Not a valid phone no' : '';
  }
  onSubmit(otpForm: NgForm) {
    if (!this.phone.valid) {
      return;
    }
    this.isLoading = true;

    // this.authService.sendOTP(this.phoneno);
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneno;
    // console.log(num);
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        console.log(result);
        this.otpsent = true;
        this.windowRef.confirmationResult = result;
      })
      .catch( error => {
        this.phone.reset();
      } );

    this.isLoading = false;
  }

  async openBrowser() {
    // On iOS, for example, open the URL in SFSafariViewController (the in-app browser)
    await Browser.open({ url: "https://smazee.com" });
  }
}

@Component({
  selector: 'verify-phone',
  templateUrl: 'verify-phone.html',
})
export class VerifyDialog {
  constructor(public dialogRef: MatDialogRef<VerifyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){}
}

export interface DialogData {
  email: string;
  pass: string;
}



