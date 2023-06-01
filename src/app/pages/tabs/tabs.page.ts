import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    public router: Router,
    public activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.loginSub = this.authService.isLoggedIn().subscribe((isLoggedIn) => { this.isLoggedIn = isLoggedIn });
  };

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  };

  isMenuButtonActive(routePath: string): boolean {
    return this.activatedRoute.snapshot.url.join('/') === 'tabs/' + routePath;
  };
}
