import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-paswoord',
  templateUrl: './reset-paswoord.component.html',
  styleUrls: ['./reset-paswoord.component.scss'],
})
export class ResetPaswoordComponent implements OnInit {

  email: string;
  succes: boolean = false;

  constructor(private modalController: ModalController,
    private authService: AuthService) { }

  ngOnInit() { }
  async resetPassword() {
    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.succes = true;
    } catch (error) {
      console.log(error);
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

}
