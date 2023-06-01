import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Kandidaat from 'src/app/types/Kandidaat';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-top10',
  templateUrl: './top10.page.html',
  styleUrls: ['./top10.page.scss'],
})
export class Top10Page implements OnInit, OnDestroy {

  avgPosition: string[] = []; // Array van verdachtenids gemiddelde positie bij de gebruikers
  #kandidatenSub: Subscription;
  #gebruikersSub: Subscription;
  kandidaten: Kandidaat[];
  kandidaat: Kandidaat;

  constructor(private dataService: BackendApiService, private platform: Platform, private router: Router) { }
  ngOnDestroy() {
    if (this.#kandidatenSub) {
      this.#kandidatenSub.unsubscribe();
    }
    if (this.#gebruikersSub) {
      this.#gebruikersSub.unsubscribe();
    }
  };

  ngOnInit() {
    this.#kandidatenSub = this.dataService.retrieveKandidaats().subscribe((kandidaten) => this.kandidaten = kandidaten);
    this.#gebruikersSub = this.dataService.retrieveGebruikers().subscribe((gebruikers) => {
      const nameData = this.#calculateNameData(gebruikers)
      this.avgPosition = this.#calculateAvgPosition(nameData);
      this.#sortKandidatenByAvgPosition();
    });
    this.isLargeScreen();
  };

  #calculateNameData(result: any[]): { [name: string]: any } {
    const nameData: { [name: string]: any } = {};

    result.forEach((user) => {
      user.verdachten.forEach((verdachte: string, index: number) => {
        if (!nameData[verdachte]) {
          nameData[verdachte] = {
            total: index + 1,
            count: 1,
          };
        } else {
          nameData[verdachte].total += index + 1;
          nameData[verdachte].count++;
        }
      });
    });

    return nameData;
  };

  #calculateAvgPosition(nameData: { [name: string]: any }): string[] {
    const avgPositions = Object.keys(nameData).map((name) => {
      return {
        name: name,
        averagePosition: nameData[name].total / nameData[name].count,
      };
    });
    avgPositions.sort((a, b) => a.averagePosition - b.averagePosition);
    return avgPositions.map((entry) => entry.name);
  };

  #sortKandidatenByAvgPosition() {
    const sortedKandidaten: Kandidaat[] = [];

    for (const id of this.avgPosition) {
      const kandidaat = this.kandidaten.find((k) => k.id === id);
      if (kandidaat) {
        sortedKandidaten.push(kandidaat);
      }
    }

    this.kandidaten = sortedKandidaten;
  };

  isLargeScreen(): boolean {
    return this.platform.width() >= 992; // Aanpassen aan de gewenste breekpuntbreedte voor grote schermen
  };
}
