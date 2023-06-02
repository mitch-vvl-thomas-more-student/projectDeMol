import { Component, Input, OnInit } from '@angular/core';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { GlobalsService } from 'src/app/services/globals.service';
import Gebruiker from 'src/app/types/Gebruiker';

@Component({
  selector: 'app-profiel-form',
  templateUrl: './profiel-form.component.html',
  styleUrls: ['./profiel-form.component.scss'],
})
export class ProfielFormComponent implements OnInit {
  @Input() gebruiker: Gebruiker;
  constructor(
    private dataService: BackendApiService,
    private globalsService: GlobalsService
  ) { }

  ngOnInit() { }
  async update() {
    try {
      await this.dataService.updateGebruiker(this.gebruiker);
      await this.globalsService.setGebruiker(this.gebruiker);
    } catch (error) {
      console.log(error);
    }
  };
}
