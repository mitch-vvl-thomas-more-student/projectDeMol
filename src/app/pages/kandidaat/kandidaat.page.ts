// import { GlobalsService } from './../../services/globals.service';
// import { BackendApiService } from './../../services/backend-api.service';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import Kandidaat from 'src/app/types/Kandidaat';
// import { ModalController } from '@ionic/angular';
// import { HintModalComponent } from 'src/app/components/hint-modal/hint-modal.component';


// @Component({
//   selector: 'app-kandidaat',
//   templateUrl: './kandidaat.page.html',
//   styleUrls: ['./kandidaat.page.scss'],
// })

// export class KandidaatPage implements OnInit {
//   id: string;
//   kandidaat: Kandidaat;

//   constructor(
//     private route: ActivatedRoute,
//     private apiService: BackendApiService,
//     private modalController: ModalController,
//     private router: Router,
//     private globalsService: GlobalsService
//   ) {  }

//   async ngOnInit() {
//     this.route.params.subscribe(async (params) => {
//       this.id = params['id'];
//       const x = await this.apiService.getKandidaatById(this.id);
//       if (x) {
//         this.kandidaat = x;
//       }
//     });
//   }

//    async showModal() {
//     const gebruiker = await this.globalsService.getGebruiker();
    
//     if (!gebruiker.email) {
//       const ok = confirm('Gelieve in te loggen om een hint toe the voegen');
//       if (ok){
//         this.navigate('login')
//       }
//       return;
//     }
  
//     const modal = await this.modalController.create({
//       component: HintModalComponent,
//       componentProps: { kandidaat: this.kandidaat, gebruiker },
//     });
    
//     await modal.present();
//     const { data } = await modal.onWillDismiss();
    
//     if (data && data.hint) {
//       this.kandidaat.hints.push(data.hint);
//     }
//   }
  


//   navigate(path: string){
//     this.router.navigate([path])
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { HintModalComponent } from '../../components/hint-modal/hint-modal.component';
import Kandidaat from 'src/app/types/Kandidaat';
import Hint from 'src/app/types/Hint';

@Component({
  selector: 'app-kandidaat',
  templateUrl: './kandidaat.page.html',
  styleUrls: ['./kandidaat.page.scss'],
})
export class KandidaatPage implements OnInit {
  id: string;
  kandidaat: Kandidaat;
  hints: Hint[] = [];
  publiekeHints: Hint[] = [];
  privateHints: Hint[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: BackendApiService,
    private modalController: ModalController,
    private router: Router,
    private globalsService: GlobalsService
  ) {  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      const x = await this.apiService.getKandidaatById(params['id']);
      if (x) {
        this.kandidaat = x;
        this.apiService.retrieveHintByKandidaatId(this.kandidaat.id).subscribe(async res => {
          // Store the retrieved hints in the component's state
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
  

  async showModal() {
    const gebruiker = await this.globalsService.getGebruiker();
    
    if (!gebruiker.email) {
      const ok = confirm('Gelieve in te loggen om een hint toe the voegen');
      if (ok){
        this.navigate('login')
      }
      return;
    }
  
    const modal = await this.modalController.create({
      component: HintModalComponent,
      componentProps: { kandidaat: this.kandidaat, gebruiker },
    });
    
    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    console.log(data)
    if (data && data.hint) {
      this.kandidaat.hints.push(data.hint);
      this.publiekeHints = this.hints.filter((hint : Hint) => hint.isPubliek === true);
      const gebruiker = await this.globalsService.getGebruiker();
      if (gebruiker.email) {
        this.privateHints = this.hints.filter((hint : Hint) => hint.isPubliek === false && hint.plaatser === gebruiker.id);
      }
    }
  }

  navigate(path: string){
    this.router.navigate([path])
  }
}
