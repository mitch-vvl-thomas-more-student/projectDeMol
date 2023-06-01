import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterComponent } from 'src/app/components/register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService: AuthService, private modalController: ModalController) { }

  ngOnInit() {}

  async emailLogin() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      componentProps: {
        mode: 'register'
      }
    });
    await modal.present();
  };
}
