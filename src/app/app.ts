
import { AngularFireList } from '@angular/fire/database';

export class User {

  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  companyid: string;
  photoURL: string;
  emailVerified: boolean;
}

export class Error {

  errno: number;
  hashtag: string;
  errname: string;
  errdesc: string;
  errsoln: string;
  errtype: string;

  created: string;
  modified: string;
  sts: boolean;

  companyid: number;

}


  