import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { HintModalComponent } from '../../../../components/hint-modal/hint-modal.component';
import Kandidaat from 'src/app/types/Kandidaat';
import Hint from 'src/app/types/Hint';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kandidaat',
  templateUrl: './kandidaat.page.html',
  styleUrls: ['./kandidaat.page.scss'],
})
export class KandidaatPage implements OnInit {
  #kandidaatsSub: Subscription;
  #routeSub: Subscription;

  id: string;
  kandidaat: Kandidaat;
  hints: Hint[] = [];
  publiekeHints: Hint[] = [];
  privateHints: Hint[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: BackendApiService,
    private modalController: ModalController,
    private globalsService: GlobalsService
  ) { }

  async ngOnInit() {
    this.#routeSub = this.route.params.subscribe(async (params) => {
      const x = await this.apiService.getKandidaatById(params['id']);
      if (x) {
        this.kandidaat = x;
        this.#kandidaatsSub = this.apiService.retrieveHintByKandidaatId(this.kandidaat.id).subscribe(async res => {
          this.hints = res;
          this.publiekeHints = this.hints.filter((hint: Hint) => hint.isPubliek === true);
          const gebruiker = await this.globalsService.getGebruiker();
          if (gebruiker.email) {
            this.privateHints = this.hints.filter((hint: Hint) => hint.isPubliek === false && hint.plaatser === gebruiker.id);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.#kandidaatsSub) {
      this.#kandidaatsSub.unsubscribe();
    }

    if (this.#routeSub) {
      this.#routeSub.unsubscribe();
    }
  }

  async showModal() {
    const gebruiker = await this.globalsService.getGebruiker();

    if (!gebruiker.email) {
      this.globalsService.notLoggedIn();
      return;
    }

    const modal = await this.modalController.create({
      component: HintModalComponent,
      componentProps: { kandidaat: this.kandidaat, gebruiker },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.hint) {
      this.kandidaat.hints.push(data.hint);
      this.publiekeHints = this.hints.filter((hint: Hint) => hint.isPubliek === true);
      const gebruiker = await this.globalsService.getGebruiker();
      if (gebruiker.email) {
        this.privateHints = this.hints.filter((hint: Hint) => hint.isPubliek === false && hint.plaatser === gebruiker.id);
      }
    }
  }

}
