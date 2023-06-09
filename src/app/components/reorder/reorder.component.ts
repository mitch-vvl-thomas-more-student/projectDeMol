import { GlobalsService } from './../../services/globals.service';
import { Component, Input, OnInit } from '@angular/core';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Kandidaat from 'src/app/types/Kandidaat';
import Gebruiker from 'src/app/types/Gebruiker';

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.scss'],
})
export class ReorderComponent implements OnInit {
  @Input() kandidatenIds: string[] | undefined
  
  kandidaten: Kandidaat[]
  gebruiker: Gebruiker;
  colors: string[] = ['red', 'green', 'blue'];

  constructor(private backService: BackendApiService, private globalService: GlobalsService) { }

  ngOnInit() {
    if (this.kandidatenIds) {
      const promises = this.kandidatenIds.map(id => this.backService.getKandidaatById(id));
      Promise.all(promises).then(kandidaten => {
        this.kandidaten = kandidaten.filter(kandidaat => kandidaat !== null) as Kandidaat[];
      });
    }
  };

  async handleReorder(event: any) {
    try {
      event.detail.complete();
      const item = this.kandidaten.splice(event.detail.from, 1)[0];
      this.kandidaten.splice(event.detail.to, 0, item);
      this.gebruiker = await this.globalService.getGebruiker();
      this.gebruiker.verdachten = this.kandidaten.map(x => x.id);
      await this.backService.updateGebruiker(this.gebruiker);
      await this.globalService.setGebruiker(this.gebruiker);
    } catch (error) {
      console.log(error);
    }
  };
}
