import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { AuthService } from 'src/app/auth.service';
import { Errorlst } from 'src/app/app';




@Component({
  selector: 'app-adderror',
  templateUrl: './adderror.component.html',
  styleUrls: ['./adderror.component.scss']
})
export class AdderrorComponent implements OnInit {

  errorForm: FormGroup;
  err: Errorlst = new Errorlst();
  
  modes: string[] = ['Syntax', 'Logical', 'Semantic', 'Run-time'];
  vendorList = [];
  i: number;
  k :number =0;

  constructor(private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
      
  }

  ngOnInit() {

    this.errorForm = new FormGroup({

      'errno': new FormControl(null, [Validators.required]),

      'hashtag': new FormControl(null, [Validators.required]),
      'errname': new FormControl(null, [Validators.required]),
      'errdesc': new FormControl(null, [Validators.required]),
      'errsoln': new FormControl(null, [Validators.required]),

      'errtype': new FormControl(null, [Validators.required]),
    })
  }

  onSubmit() {

    if (!this.errorForm.valid) {
      console.log("Invalid Data");
      return;
    }

    this.err.created = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZZZZ', 'en_US');
    this.err.modified = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZZZZ', 'en_US');
    this.err.sts = true;

    const key = this.auth.createError(this.err);

    this.err = new Errorlst();
    this.router.navigate(['/error']);
  }
}
