import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';

const { Network } = Plugins;
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  private dbPath = 'clients';

  title = 'Spot-Tag';

  showSpinner: boolean = true;
  clients: Observable<any[]>;

  constructor(private db: AngularFireDatabase,private _snackBar: MatSnackBar) {

    let handler = Network.addListener('networkStatusChange', (status) => {

      if(!status.connected){
        let snackBarRef = _snackBar.open('Check Connection');
      }
      
      else{
        _snackBar.dismiss()
      }
      console.log("Network status changed", status);
    });
  }

  ngOnInit(): void {
    this.clients = this.db.list(this.dbPath).valueChanges();
    this.clients.subscribe(() => this.showSpinner = false)
  }

}
