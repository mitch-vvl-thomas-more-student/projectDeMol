import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  loginSub: Subscription;
  isLoggedIn: boolean = false;
  constructor(
    public authService: AuthService, 
    public router: Router) { 
   }

  ngOnInit() {
    this.loginSub = this.authService.isLoggedIn().subscribe((res) => {this.isLoggedIn = res});
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }

}
