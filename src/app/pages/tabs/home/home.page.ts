import { PhotoService } from '../../../services/photo.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { GlobalsService } from '../../../services/globals.service';
import { Component } from '@angular/core';
import Gebruiker from 'src/app/types/Gebruiker';
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
    private photoService: PhotoService,
    private storageService: StorageService,
    private globalsService: GlobalsService,
    public authService: AuthService) { }
    
  async ngOnInit() {
    this.gebruiker = await this.globalsService.getGebruiker();
    this.profileImageUrl$ = await this.storageService.getProfileImageUrl(this.gebruiker);
  };

  async openFilePicker() {
      const imageUrl = await this.photoService.takePhoto();
      this.profileImageUrl$ = await this.storageService.uploadImageFromMobile(imageUrl, this.gebruiker);
  };

  async uploadImageFromWeb(event: any): Promise<void> {
    const file: File = event.target.files[0];
    this.profileImageUrl$ = await this.storageService.uploadImageFromWeb(file, this.gebruiker);
  };

}