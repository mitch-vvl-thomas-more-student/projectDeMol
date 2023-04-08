import Gebruiker from 'src/app/types/Gebruiker';
import Kandidaat from 'src/app/types/Kandidaat';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  #kandidaten: Kandidaat[];
  #gebruiker: Gebruiker;
  #gebruikerChange = new Subject<Gebruiker>();
  #kandidatenChange = new Subject<Kandidaat[]>();

  constructor() { }

  async setGebruiker(gebruiker: Gebruiker): Promise<void> {
    return new Promise((resolve) => {
      this.#gebruiker = gebruiker;
      this.#gebruikerChange.next(gebruiker);
      resolve();
    });
  }

  async getGebruiker(): Promise<Gebruiker> {
    if (this.#gebruiker) {
      return Promise.resolve(this.#gebruiker);
    }
  
    return new Promise<Gebruiker>((resolve) => {
      const subscription = this.#gebruikerChange.subscribe((gebruiker: Gebruiker) => {
        resolve(gebruiker);
        subscription.unsubscribe();
      });
  
      const timeout = setTimeout(() => {
        subscription.unsubscribe();
        resolve({} as Gebruiker);
      }, 3000);
    });
  }
  
  



  async setKandidaten(kandidaten: Kandidaat[]): Promise<void> {
    return new Promise((resolve) => {
      this.#kandidaten = kandidaten;
      this.#kandidatenChange.next(kandidaten);
      resolve();
    });
  }

  async getKandidaten(): Promise<Kandidaat[]> {
    return new Promise((resolve) => {
      if (this.#kandidaten) {
        resolve(this.#kandidaten);
      } else {
        const subscription = this.#kandidatenChange.subscribe((kandidaten: Kandidaat[]) => {
          resolve(kandidaten);
          subscription.unsubscribe();
        });
      }
    });
  }
}
