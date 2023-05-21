import { GlobalsService } from 'src/app/services/globals.service';
import { Subscription } from 'rxjs';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Component, Input, OnInit } from '@angular/core';
import { GeoCodeService } from 'src/app/services/geocode.service';
import { LoginAttempt } from 'src/app/types/LoginAttempt';
import { PopoverController } from '@ionic/angular';
import { PopoverContentComponent } from '../popover/popover.component';
import { Timestamp } from 'firebase/firestore';
import Gebruiker from 'src/app/types/Gebruiker';

@Component({
  selector: 'app-login-attempts',
  templateUrl: './login-attempts.component.html',
  styleUrls: ['./login-attempts.component.scss'],
})
export class LoginAttemptsComponent implements OnInit {
  loginAttempts: LoginAttempt[] = [];
  loginAttemptsSubsriber: Subscription;
  isPopoverOpen = false;
  selectedLoginAttempt: LoginAttempt | null = null;
  @Input() gebruiker: Gebruiker;

  constructor(private geoCodeService: GeoCodeService,
    private backService: BackendApiService,
    private popoverController: PopoverController) {
  }

  ngOnInit() {
    this.loginAttemptsSubsriber = this.backService.retrieveLoginAttempts(this.gebruiker?.id).subscribe(
      (res) => {
        this.loginAttempts = res;
        this.loginAttempts.forEach((loginAttempt) => {
          const date = new Date(
            (loginAttempt.datetime as unknown as Timestamp).seconds * 1000 +
            (loginAttempt.datetime as unknown as Timestamp).nanoseconds / 1000000
          );
          
          const dateString = date.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          });
          loginAttempt.dateString = `${dateString}u`;
        });
      })
  }

  ngOnDestroy() {
    this.loginAttemptsSubsriber.unsubscribe();
  }

  async showMap(event: MouseEvent, loginAttempt: LoginAttempt) {
    const popover = await this.popoverController.create({
      component: PopoverContentComponent,
      translucent: true,
      event,
      animated: true,
      componentProps: {
        latitude: parseFloat(loginAttempt.location.latitude),
        longitude: parseFloat(loginAttempt.location.longitude),
      },
    });

    this.selectedLoginAttempt = loginAttempt;
    this.isPopoverOpen = true;
    await popover.present();
  }

  hideMap() {
    this.isPopoverOpen = false;
    this.popoverController.dismiss();
  }
}
