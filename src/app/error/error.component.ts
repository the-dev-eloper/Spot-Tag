import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Inject } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {Observable, Subject, from} from 'rxjs';

import { AuthService } from '../auth.service';
import { DynamicScriptLoaderService } from '../dynamic-script-loader.service';
import * as moment from 'moment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})

export class ErrorComponent implements OnInit {

  errors = [];
  i: number;
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>(this.errors);
  isLoading : boolean = true;
  companyId: any;

  dateRange:any;
  fromDate: Date;
  toDate: Date;
  filterValue: any = '';

  constructor(private auth: AuthService,
    private router: Router,
    private dynamicScriptLoader: DynamicScriptLoaderService,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet) {

    this.companyId = this.auth.getUserData().companyid;
    this.getErrorList();
  }

  ngOnInit() {
  }

  private loadScripts() {

    this.dynamicScriptLoader.load('swipe').then(data => {
      }).catch(error => console.log(error));
  }

  viewErr(key) {

    this._bottomSheet.open(
      PrintErrComp, {data: { item: key }},
    );
  }

  getErrorList() {

    this.auth.getErrorList().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(errors => {
      console.log(errors);

      for(this.i = 0; this.i < errors.length; this.i++ ) {
        if(errors[this.i].sts == true && errors[this.i].companyid == this.companyId) {
          this.errors.push(errors[this.i])
        }
      }

      console.log(this.errors)
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.errors);
      this.isLoading = false;
      this.loadScripts();
      this.errors = [];
    });
  }

  deleteErr(key: any) {

    const dialogRef = this.dialog.open(ConfirmDeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.auth.deleteError(key);
      }else{}
    });
  }

  editExp(key: any) {
    this.router.navigate(['/error/editerror',key])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filteredData);
    this.filterDates();
  }

  filterDates(){

    this.dataSource.filteredData = this.dataSource.data

    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if(!this.dateRange)return;
    this.fromDate = new Date(this.dateRange.begin);
    this.toDate = new Date(this.dateRange.end);
    this.dataSource.filteredData = this.dataSource.filteredData.filter(e=> moment(e.billdate).isBetween(this.fromDate, this.toDate));
  }
}

@Component({
  selector: 'confirm-delete',
  templateUrl: 'confirm-delete.html',
})
export class ConfirmDeleteDialog {}


@Component({
  selector: 'print-err',
  templateUrl: 'print-err.html',
})

export class PrintErrComp {

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  items: any;
  custDetails = null;
  compDetails = null;
  subtotal: number;
  avgtax: number;
  err: any;
  dynamicArray: any = [];

  constructor(private _bottomSheetRef: MatBottomSheetRef<PrintErrComp>,
    private auth: AuthService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {

      this.err = data.item;

      this.auth.getCompanyDetails(data.item.companyid).then(res => {
        this.compDetails = res;
      });
  }

  closeLink(): void {
    this._bottomSheetRef.dismiss();
  }
}

export interface PeriodicElement {

  errno: number;
  hashtag: string;
  errname: string;
  errdesc: string;
  errsoln: string;
  errtype: string;

  billdate: string;

  created: string;
  modified: string;
  sts: boolean;
}