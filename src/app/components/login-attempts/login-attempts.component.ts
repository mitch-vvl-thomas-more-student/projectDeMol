import { Subscription } from 'rxjs';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoginAttempt } from 'src/app/interfaces/LoginAttempt';
import { AlertController, ModalController } from '@ionic/angular';
import { PopoverContentComponent } from '../popover/popover.component';
import { Timestamp } from 'firebase/firestore';
import Gebruiker from 'src/app/types/Gebruiker';
import { RegisterComponent } from '../register/register.component';
import { AuthProviders } from 'src/app/enums/authProviders';

@Component({
  selector: 'app-login-attempts',
  templateUrl: './login-attempts.component.html',
  styleUrls: ['./login-attempts.component.scss'],
})
export class LoginAttemptsComponent implements OnInit, OnDestroy {
  @Input() gebruiker: Gebruiker;

  loginAttempts: LoginAttempt[] = [];
  loginAttemptsSubsriber: Subscription;
  isPopoverOpen = false;
  selectedLoginAttempt: LoginAttempt | null = null;
  passwordRecoveryUrl: string = '';
  recoveryMethod: string = 'Wijzig je wachtwoord';

  constructor(
    private alertController: AlertController,
    private backendApiService: BackendApiService,
    private modalController: ModalController) {
  }

  ngOnInit() {
    this.loginAttemptsSubsriber = this.backendApiService.retrieveLoginAttempts(this.gebruiker?.id).subscribe(
      (res) => {
        this.loginAttempts = res;
        this.loginAttempts.sort((a, b) => {
          const dateA = new Date(
            (a.datetime as unknown as Timestamp).seconds * 1000 +
            (a.datetime as unknown as Timestamp).nanoseconds / 1000000
          );
          const dateB = new Date(
            (b.datetime as unknown as Timestamp).seconds * 1000 +
            (b.datetime as unknown as Timestamp).nanoseconds / 1000000
          );
          return dateB.getTime() - dateA.getTime();
        });
        this.loginAttempts.forEach(async (loginAttempt) => {
          const date = new Date(
            (loginAttempt.datetime as unknown as Timestamp).seconds * 1000 +
            (loginAttempt.datetime as unknown as Timestamp).nanoseconds / 1000000
          );

          const dateString = await date.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          });
          
          loginAttempt.dateString = `${dateString}u`;
        });
      })
  };

  ngOnDestroy() {
    this.loginAttemptsSubsriber.unsubscribe();
  };

  async showMap(event: MouseEvent, loginAttempt: LoginAttempt) {
    const popover = await this.modalController.create({
      component: PopoverContentComponent,
      animated: true,
      componentProps: {
        loginAttempt: loginAttempt,
        mode: 'address'
      },
    });

    this.selectedLoginAttempt = loginAttempt;
    this.isPopoverOpen = true;
    await popover.present();
  };

  async showSystemInfo(event: MouseEvent, loginAttempt: LoginAttempt) {
    const alert = await this.alertController.create({
      header: 'Systeem informatie',
      message: `platform: ${loginAttempt.system.platform}<br />
          model: ${loginAttempt.system.model}<br />
          osVersion: ${loginAttempt.system.osVersion}`,
      buttons: ['OK']
    });

    await alert.present();
  };

  hideMap() {
    this.isPopoverOpen = false;
    this.modalController.dismiss();
  };

  setPasswordRecoveryUrl(method: string) {
   switch (method.toLowerCase()) {
      case AuthProviders.email:
        this.passwordRecoveryUrl = `eigen website`;
        break;
      case AuthProviders.facebook:
        this.passwordRecoveryUrl = `https://nl-nl.facebook.com/help/messenger-app/148759965285982`;
        this.recoveryMethod = 'Wijzig je wachtwoord via Facebook';
        break;
      case AuthProviders.google:
        this.passwordRecoveryUrl = `https://support.google.com/accounts/answer/41078`;
        this.recoveryMethod = 'Wijzig je wachtwoord via Google';
        break;
      default:
        break;
    }

    this.#passwordRecovery();
  };
  
  #passwordRecovery() {
    if (this.passwordRecoveryUrl === 'eigen website') {
      this.resetPassword();
    } else {
      window.open(this.passwordRecoveryUrl, '_blank');
    }
  };

  async resetPassword() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      componentProps: {
        mode: 'passwordReset'
      }
    });
    await modal.present();
  };
}
