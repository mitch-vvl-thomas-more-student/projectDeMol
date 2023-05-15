import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  result: string | undefined;
  timer: any;
  email: string;
  emailOk: boolean = false;
  paswoordOk: boolean = false;
  paswoord: string;
  emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*(\.[a-zA-Z]{2,})$/);
  paswoordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

  constructor(
    private errS: ErrorService,
    private auth: AuthService,
    private modalController: ModalController) { }

  ngOnInit() { }

  async register() {
    // Perform the login
    const loginResult = await this.auth.registreerGebruikerMetEmail(this.email, this.paswoord);

    if (loginResult === 'loggedin') {
      // User logged in successfully
      // Perform any necessary actions
      console.log('loggedin');

    } else if (loginResult === 'wrongpassword') {
      // Show alert for wrong password
      this.errS.showAlert('Foutief wachtwoord', 'Het ingevoerde wachtwoord is onjuist.')
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  testMail() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.emailOk = this.emailRegexp.test(this.email);
    }, 200); // Adjust the delay as needed
  }

  testPaswoord() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.paswoordOk = this.paswoordRegex.test(this.paswoord);
    }, 200); // Adjust the delay as needed
  }

}
