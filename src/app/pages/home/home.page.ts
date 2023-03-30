import { GlobalsService } from './../../services/globals.service';
import Kandidaat from 'src/app/types/Kandidaat';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Gebruiker from 'src/app/types/Gebruiker';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  kandidaten: Kandidaat[];
  gebruiker: Gebruiker;

  constructor(private dataService: BackendApiService, 
    private globalsService: GlobalsService, 
    private authService: AuthService) {
  }
  async ngOnInit() {

    this.gebruiker = await this.globalsService.getGebruiker();
   // this.kandidaten = await this.globalsService.getKandidaten();
    console.log(this.gebruiker);   
  }

 async update(){
    await this.dataService.updateGebruiker(this.gebruiker);
    await this.globalsService.setGebruiker(this.gebruiker);
  }
}
