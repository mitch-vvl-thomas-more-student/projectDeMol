import { PhotoService } from '../../../services/photo.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { GlobalsService } from '../../../services/globals.service';
import { Component } from '@angular/core';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Gebruiker from 'src/app/types/Gebruiker';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isMobile: boolean;
  gebruiker: Gebruiker;
  profileImageUrl$: string | null = null;
  uploadSub: Subscription | undefined;

  constructor(
    private photoService : PhotoService,
    private storageService: StorageService,
    private dataService: BackendApiService,
    private globalsService: GlobalsService,
    public authService: AuthService) { }
  async ngOnInit() {
    this.gebruiker = await this.globalsService.getGebruiker();
    this.profileImageUrl$ = await this.storageService.getProfileImageUrl(this.gebruiker);
  }
 

  async update() {
    await this.dataService.updateGebruiker(this.gebruiker);
    await this.globalsService.setGebruiker(this.gebruiker);
  }
  async openFilePicker() {
    if (Capacitor.isNativePlatform()) {
      const imageUrl = await this.photoService.takePhoto();
      this.profileImageUrl$ = await this.storageService.uploadImageFromMobile(imageUrl, this.gebruiker);
    } else {
       document.getElementById('btn_file')?.click();
    }
  }
  async uploadImageFromWeb(event: any): Promise<void> {
    const file: File = event.target.files[0];
    this.profileImageUrl$ = await this.storageService.uploadImageFromWeb(file, this.gebruiker);
  }

}