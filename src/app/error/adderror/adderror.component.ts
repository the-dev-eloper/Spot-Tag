import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';

import {MatPaginator} from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { AuthService } from 'src/app/auth.service';
import { Error } from 'src/app/app';

@Component({
  selector: 'app-adderror',
  templateUrl: './adderror.component.html',
  styleUrls: ['./adderror.component.scss']
})

export class AdderrorComponent implements OnInit {

  errorForm: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  error: Error = new Error();
  companyId: any;

  totalType = [
    {name:"Syntax Error"},
    {name:"Logical Error"},
    {name:"Semantic Error"},
    {name:"Run-time Error"},
  ]

  constructor(private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
      this.companyId = this.auth.getUserData().companyid;
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

    this.error.created = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZZZZ', 'en_US');
    this.error.modified = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZZZZ', 'en_US');
    this.error.sts = true;

    const key = this.auth.createError(this.error);

    this.error = new Error();
    this.router.navigate(['/error']);
  }
}
