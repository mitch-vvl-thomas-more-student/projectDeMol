import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoCode } from 'src/app/interfaces/geoCode';
import { GeoCodeService } from 'src/app/services/geocode.service';
import { LoginAttempt } from 'src/app/types/LoginAttempt';


@Component({
  selector: 'app-popover-content',
  templateUrl: './popover.component.html',
})
export class PopoverContentComponent {
  @Input() loginAttempt: LoginAttempt;
  @Input() mode: string;
  address: GeoCode;
  

  constructor(
    private geoCodeService: GeoCodeService, 
    private modalController: ModalController) { }

  ngOnInit() {
    const { latitude, longitude } = this.loginAttempt.location;
    if (latitude && longitude)
      this.getAddress(latitude, longitude);
  }

  async getAddress(latitude: string, longitude: string) {
    try {
      this.address = await this.geoCodeService.getGeoCode(latitude, longitude);
    } catch (error) {
      console.error('Error retrieving address:', error);
    }
  }

  hideMap() {
    this.modalController.dismiss();
  }
}

