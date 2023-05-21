import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  mode: string = 'register';
  result: string | undefined;
  timer: any;
  email: string;
  emailOk: boolean = false;
  paswoordOk: boolean = false;
  paswoord: string;
  voornaam: string;
  achternaam: string;
  geboortedatum: Date;
  emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*(\.[a-zA-Z]{2,})$/);
  paswoordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

  constructor(
    private auth: AuthService,
    private modalController: ModalController) { }

  ngOnInit() { }

  async dismiss() {
    await this.modalController.dismiss();
  }

  testMail() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.emailOk = this.emailRegexp.test(this.email);
    }, 200);
  }

  testPaswoord() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.paswoordOk = this.paswoordRegex.test(this.paswoord);
    }, 200);
  }

  toggleMode() {
    if (this.mode === 'login') {
      this.mode = 'register';
    } else {
      this.mode = 'login';
    }
  }

  async register() {
    // Perform the login or registration
    const loginResult = await this.auth.registreerGebruikerMetEmail(this.email, this.paswoord, this.voornaam, this.achternaam, this.geboortedatum.toLocaleDateString('nl-BE'));
    this.dismiss();
  }

  async aanmelden() {
    const loginResult = await this.auth.aanmeldenMetEmail(this.email, this.paswoord);
    this.dismiss();
  }

  async passwordReset() {
    this.testMail();
    if (!this.emailOk) {
      this.auth.sendPasswordResetEmail(this.email);
    }
  }
}
