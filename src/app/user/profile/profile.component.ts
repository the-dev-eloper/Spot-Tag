import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router) { }
  userData;
  ngOnInit() {
    this.userData = this.authService.getUserData();
    console.log(this.userData);
  }

  logout(){
    this.authService.logout();
  }

}
