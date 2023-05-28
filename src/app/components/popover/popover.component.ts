import { Component, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { GeoCode } from 'src/app/interfaces/geoCode';
import { GeoCodeService } from 'src/app/services/geocode.service';
import { LoginAttempt } from 'src/app/types/LoginAttempt';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover.component.html',
})
export class PopoverContentComponent {
  @Input() loginAttempt: LoginAttempt;
  address: GeoCode;
  passwordRecoveryUrl: string = '';
  recoveryMethod: string = 'Wijzig je wachtwoord';

  constructor(private geoCodeService: GeoCodeService, private popoverController: PopoverController,private modalController: ModalController) { }

  ngOnInit() {
    const { method } = this.loginAttempt;
    const { latitude, longitude } = this.loginAttempt.location;

    if (method) {
      this.setPasswordRecoveryUrl(method);
    }

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

  setPasswordRecoveryUrl(method: string) {
    switch (method.toLowerCase()) {
      case 'email/wachtwoord':
        this.passwordRecoveryUrl = `eigen website`;
        break;
      case 'facebook':
        this.passwordRecoveryUrl = `https://nl-nl.facebook.com/help/messenger-app/148759965285982`;
        this.recoveryMethod = 'Wijzig je wachtwoord via Facebook';
        break;
      case 'google':
        this.passwordRecoveryUrl = `https://support.google.com/accounts/answer/41078`;
        this.recoveryMethod = 'Wijzig je wachtwoord via Google';
        break;
      default:
        break;
    }
  }

  hideMap() {
    this.popoverController.dismiss();
  }

  passwordRecovery() {
    if (this.passwordRecoveryUrl === 'eigen website') {
      this.resetPassword();
    } else {
      window.open(this.passwordRecoveryUrl, '_blank');
    }
  }

  async resetPassword() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      componentProps: {
        mode: 'passwordReset'
      }
    });
    await modal.present();
  }
}

