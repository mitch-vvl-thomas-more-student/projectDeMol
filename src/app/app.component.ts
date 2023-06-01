import Gebruiker from 'src/app/types/Gebruiker';
import Kandidaat from 'src/app/types/Kandidaat';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BackendApiService } from './services/backend-api.service';
import { GlobalsService } from './services/globals.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  #currentUserSub: Subscription;
  #kandidaatsSub: Subscription;

  constructor(private dataService: BackendApiService,
    private authService: AuthService,
    private globalService: GlobalsService,
  ) { SplashScreen.hide(); }

  ngOnInit() {
    this.#currentUserSub = this.authService.currentUser.subscribe(user => {
      if (user?.email) {
        this.dataService.retrieveGebruikerByEmail(user?.email)
          .subscribe((res: Gebruiker[]) => this.globalService.setGebruiker(res[0]));
      }
    });

    this.#kandidaatsSub = this.dataService.retrieveKandidaats()
      .subscribe((res: Kandidaat[]) => this.globalService.setKandidaten(res));
  }

  ngOnDestroy() {
    if (this.#currentUserSub) {
      this.#currentUserSub.unsubscribe();
    }

    if (this.#kandidaatsSub) {
      this.#kandidaatsSub.unsubscribe();
    }
  }

}
