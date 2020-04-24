
import { Injectable,NgZone  } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { AngularFireDatabase, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase';
import * as admin from "firebase-admin";

import { User } from './app';
import { formatDate } from '@angular/common';

import { Errorlst } from './app';
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User;

  errorRef: AngularFireList<Error> = null;
  userRef: AngularFireList<User> ;

  constructor(private http: HttpClient,
    private dbs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router) {

    this.errorRef = dbs.list('/error');
    this.userRef = dbs.list('/user');
  }

  createError(err: Errorlst) {
    return this.errorRef.push(err).key;
  }

  get isLoggedIn(): boolean {

    const user = JSON.parse(localStorage.getItem('userData'));
    // console.log(user);
    return (user !== null) ? true : false;
  }

  // Profile, Login

  signup(email: string, password:string) {
    return this.http.post<AuthSignUpResponseData>(
     'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebase.apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }    
    );
  }

  signin(email: string, password:string) {
    return this.http.post<AuthSignInResponseData>(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebase.apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }    
    );
  }

  signInWithEmailAndPassword(email: string, password:string) {

    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
        this.setUserdata(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  logout(){
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
  }

  async setUserdata(user: firebase.User){
    let userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastLogin: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZZZZ', 'en_US')
    }
    this.userRef.update(`/${user.uid}`,userData);
    // this.userRef.push(userData);
    
    // this.dbs.database.ref('/user').child(`/${user.uid}`).orderByValue().on("value", function(snapshot) {
    //   snapshot.forEach(function(data) {
    //     console.log(data);
    //     console.log("The " + data.key + " score is " + data.val());
    //     userData['companyid'] = data.val().companyid ;
    //   });
    // });
    
    userData['userType']  = await this.getuserType(user.uid);
    console.log(userData);
    if(userData['userType'] == 'admin')
    localStorage.setItem('userData',JSON.stringify(userData));
    this.router.navigate(['/']);
  }

  async getuserType(id: string){
    var res= this.dbs.database.ref('/user').child(`/${id}`).once('value').then( function(snapshot) {
      return snapshot.val().userType;
    });
    return res;
  }

  getUserData(){
    
    const user = JSON.parse(localStorage.getItem('userData'));
    return user;
  }

  createCustomToken(uid: any){
    // var adminFire = admin.initializeApp(environment.firebase);

    // adminFire.auth().createCustomToken(uid)
    // .then(function(customToken) {
    //   // Send token back to client
    //   console.log('Custom token created:', customToken);
    // })
    // .catch(function(error) {
    //   console.log('Error creating custom token:', error);
    // });
  }
  
  testtemp =[];
  x = null;

  createUserWithEmailAndPassword(email: string, password:string, phone: string,companyid: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = {
          uid: result.user.uid,
          email: email,
          phoneNumber: phone,
          companyid: companyid,
          userType: 'user',
          sts: true
        }
        this.dbs.database.ref('/user').child(user.uid).set(user);
        
        this.afAuth.auth.sendPasswordResetEmail(email);
      }).catch((error) => {
        window.alert(error.message)
      })
  }
  createUserWithPhoneOTP(phone: string,companyid: string){
    // admin.auth().createUser({
    //   phoneNumber: phone,
    //   disabled: false
    // }).then(function(userRecord) {
    //   // See the UserRecord reference doc for the contents of userRecord.
    //   const user = {
    //     uid: userRecord.uid,
    //     phoneNumber: phone,
    //     companyid: companyid,
    //     userType: 'user',
    //     sts: true
    //   }
    //   this.dbs.database.ref('/user').child(user.uid).set(user);
    //   console.log('Successfully created new user:', userRecord.uid);
    // })
    // .catch(function(error) {
    //   console.log('Error creating new user:', error);
    // });

  }
  reqResetPassword(email: string){
    console.log(this.afAuth.auth.sendPasswordResetEmail(email));
  }
}

