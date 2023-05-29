import { ErrorService } from './../../services/error.service';
import { GlobalsService } from './../../services/globals.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Hint from 'src/app/types/Hint';
import Kandidaat from 'src/app/types/Kandidaat';
import Gebruiker from 'src/app/types/Gebruiker';

@Component({
  selector: 'app-hint-modal',
  templateUrl: './hint-modal.component.html',
  styleUrls: ['./hint-modal.component.scss'],
})
export class HintModalComponent {

  @Input() kandidaat: Kandidaat;
  @Input() gebruiker: Gebruiker;

  hint: Hint = new Hint();
  tip: string = '';
  disable: boolean = true;
  isPubliek: boolean = true;
  constructor(
    private errService: ErrorService,
    private modalController: ModalController,
    private backEndApiService: BackendApiService,
    private globalService: GlobalsService) { }

  async closeModal() {
    try {
      await this.modalController.dismiss(this.hint);
    } catch (error) {
      console.log(error);
    }
  }

  async onSubmit() {
    // Create a new hint object and emit it to the parent component
    const newHint = new Hint();
    newHint.kandidaat = this.kandidaat.id;
    newHint.plaatser = this.gebruiker.id;
    newHint.datum = new Date();
    newHint.hint = this.tip;
    newHint.stemmenOmhoog = 0;
    newHint.stemmenOmlaag = 0;
    newHint.opmerkingen = [];
    newHint.isPubliek = this.isPubliek;
    newHint.gestemdDoor = [];
    this.hint = new Hint(); // Reset the form

    try {
      const fireStoreHintId = await this.backEndApiService.addHint(newHint);
      if (fireStoreHintId.length > 0) {
        this.gebruiker.geplaatsteHints.push(fireStoreHintId);
        this.kandidaat.hints.push(fireStoreHintId);
        await this.globalService.setGebruiker(this.gebruiker);
        await this.backEndApiService.updateGebruiker(this.gebruiker);
        await this.backEndApiService.updateKandidaat(this.kandidaat);
      }
      else {
        this.errService.showAlert('Fout', 'Er ging iets mis tijdens het opslaan van u hint... Probeer het nog eens. ')
      }
    } catch (error) {
      console.log(error);
    }

    this.modalController.dismiss(newHint);
  }

  onHintChange(event: any) {
    this.tip = event.target.value;
    if (this.tip.length > 25) {
      this.disable = false;
    }
  }
}