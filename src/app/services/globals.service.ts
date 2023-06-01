import Gebruiker from 'src/app/types/Gebruiker';
import Kandidaat from 'src/app/types/Kandidaat';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  #kandidaten: Kandidaat[];
  #gebruiker: Gebruiker;
  #gebruikerChange = new Subject<Gebruiker>();
  #kandidatenChange = new Subject<Kandidaat[]>();

  constructor(private alertController: AlertController, private router: Router) { }

  async setGebruiker(gebruiker: Gebruiker): Promise<void> {
    return new Promise((resolve) => {
      this.#gebruiker = gebruiker;
      this.#gebruikerChange.next(gebruiker);
      resolve();
    });
  };

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
      }, 500);
    });
  };

  async setKandidaten(kandidaten: Kandidaat[]): Promise<void> {
    return new Promise((resolve) => {
      this.#kandidaten = kandidaten;
      this.#kandidatenChange.next(kandidaten);
      resolve();
    });
  };

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
  };

  notLoggedIn() {
    const presentAlert = async () => {
      const alert = await this.alertController.create({
        header: 'Hint toevoegen',
        message: 'Gelieve in te loggen om een hint toe te voegen',
        buttons: [
          {
            text: 'Annuleren',
            role: 'cancel',
            handler: () => {
              console.log('Annuleren gekozen');
              console.log('alert closed');
            }
          },
          {
            text: 'Inloggen',
            handler: async () => {
              await this.navigate(['login']);
            }
          }
        ]
      });
  
      await alert.present();
    };
  
    presentAlert();
    return;
  };

  async navigate(path: string[]): Promise<boolean> {
    return await this.router.navigate(path)
  };
}
