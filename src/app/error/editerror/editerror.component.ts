
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Error } from 'src/app/app';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { from } from 'rxjs';

@Component({
  selector: 'app-editerror',
  templateUrl: './editerror.component.html',
  styleUrls: ['./editerror.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_FORMATS, useValue: MatMomentDateModule},
  ],
})

export class EditerrorComponent implements OnInit {

  editErrorForm: FormGroup;
  error: Error = new Error();
  companyId: any;
  errid: any;

  constructor(private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

      this.companyId = this.auth.getUserData().companyid;
      this.route.params.subscribe( (params:Params)=> {
      this.errid = params['id'];
    });
    this.setErrVar();
  }

  ngOnInit() {

    this.editErrorForm = new FormGroup({
      'errname': new FormControl(null, [Validators.required]),
      'hashtag': new FormControl(null, [Validators.required]),
      'errdesc': new FormControl(null, [Validators.required]),
      'errsoln': new FormControl(null, [Validators.required]),
      'errtype': new FormControl(null, [Validators.required]),
    });
  }

  async setErrVar() {
    this.error = await this.auth.editError(this.errid);
  }

  onSubmit() {

    if (!this.editErrorForm.valid) {
      return;
    }
    this.error.modified = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZZZZ', 'en_US');

    this.auth.updateError(this.errid,this.error);
    this.error = new Error();
    this.router.navigate(['/error']);
  }
}
