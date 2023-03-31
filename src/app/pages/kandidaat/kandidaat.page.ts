import { GlobalsService } from './../../services/globals.service';
import { BackendApiService } from './../../services/backend-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Kandidaat from 'src/app/types/Kandidaat';
import { ModalController } from '@ionic/angular';
import { HintModalComponent } from 'src/app/components/hint-modal/hint-modal.component';
import Gebruiker from 'src/app/types/Gebruiker';


@Component({
  selector: 'app-kandidaat',
  templateUrl: './kandidaat.page.html',
  styleUrls: ['./kandidaat.page.scss'],
})

export class KandidaatPage implements OnInit {
  id: string;
  kandidaat: Kandidaat;

  constructor(
    private route: ActivatedRoute,
    private apiService: BackendApiService,
    private modalController: ModalController,
    private router: Router,
    private globalsService: GlobalsService
  ) {  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      const x = await this.apiService.getKandidaatById(this.id);
      if (x) {
        this.kandidaat = x;
      }
    });
  }

  async showModal() {
    const modal = await this.modalController.create({
      component: HintModalComponent,
      componentProps: { kandidaat: this.kandidaat, gebruiker: await this.globalsService.getGebruiker() },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.hint) {
      this.kandidaat.hints.push(data.hint);
    }
  }

  navigate(path: string){
    console.log(path)
    this.router.navigate([path])
  }
}