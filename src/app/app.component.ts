import Gebruiker from 'src/app/types/Gebruiker';
import Kandidaat from 'src/app/types/Kandidaat';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BackendApiService } from './services/backend-api.service';
import { GlobalsService } from './services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: BackendApiService,
    private authService: AuthService,
    private globalService: GlobalsService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user?.email)
        this.dataService.retrieveGebruikerByEmail(user?.email)
          .subscribe((res: Gebruiker[]) => {
            this.globalService.setGebruiker(res[0]);
          }).unsubscribe()
    });
    this.dataService.retrieveKandidaats()
      .subscribe((res: Kandidaat[]) => this.globalService.setKandidaten(res));
  }

}
