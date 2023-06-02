import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {

  loginSub: Subscription;
  isLoggedIn: boolean = false;
  constructor(
    public authService: AuthService,
    public router: Router) {
  }

  async ngOnInit() {
    this.loginSub = this.authService.isLoggedIn().subscribe((isLoggedIn) => { this.isLoggedIn = isLoggedIn });
  };

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  };
}
