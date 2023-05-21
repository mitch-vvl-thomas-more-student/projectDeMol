import { PhotoService } from './../../services/photo.service';
import { StorageService } from './../../services/storage.service';
import { AuthService } from './../../services/auth.service';
import { GlobalsService } from './../../services/globals.service';
import { Component } from '@angular/core';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Gebruiker from 'src/app/types/Gebruiker';
import { ErrorService } from 'src/app/services/error.service';
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
    private errService: ErrorService,
    private storageService: StorageService,
    private dataService: BackendApiService,
    private globalsService: GlobalsService,
    public authService: AuthService) { }
  async ngOnInit() {
    this.gebruiker = await this.globalsService.getGebruiker();
    this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker);
  }


  async update() {
    await this.dataService.updateGebruiker(this.gebruiker);
    await this.globalsService.setGebruiker(this.gebruiker);
  }
  async openFilePicker() {
    if (Capacitor.isNativePlatform()) {
      const imageUrl = await this.photoService.takePhoto();
      this.profileImageUrl$ = await this.storageService.uploadImageFromMobile(imageUrl, this.gebruiker);
    //  await this.uploadImageFromMobile(imageUrl);
    } else {
      document.getElementById('btn_file')?.click();
    }
  }
  async uploadImageFromWeb(event: any): Promise<void> {
    const file: File = event.target.files[0];
    this.profileImageUrl$ = await this.storageService.uploadImageFromWeb(file, this.gebruiker);
  }
  // async uploadImageFromWeb(event: any): Promise<void> {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     if (file.size <= 3.5 * 1024 * 1024) {
  //       if (file.type.startsWith('image/')) {
  //         try {
  //           this.storageService.deleteImage(this.gebruiker);
  //           const downloadURL = await this.storageService.uploadImage(file, this.gebruiker);
  //           if (downloadURL) {
  //             this.gebruiker.avatar = downloadURL.ref.name;
  //             this.globalsService.setGebruiker(this.gebruiker);
  //             await this.dataService.updateGebruiker(this.gebruiker);
  //             this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker)
  //           }
  //         } catch (error) {
  //           this.errService.showAlert('Fout', 'Er is een fout opgetreden tijdens het uploaden van de afbeelding.')
  //         }
  //       } else {
  //         this.errService.showAlert('Fout', 'Alleen afbeeldingsbestanden zijn toegestaan.')
  //       }
  //     } else {
  //       this.errService.showAlert('Fout', 'Het bestand is te groot. Maximaal toegestane grootte is 3.5MB.')
  //     }
  //   }
  // }
  // async uploadImageFromMobile(imageUrl: string): Promise<void> {
  //   const blob = await fetch(imageUrl).then(response => response.blob()); // convert image url to blob
  //   const file = new File([blob], 'image.jpg', { type: 'image/jpeg' }); // convert blob to file

  //   if (file.size <= 3.5 * 1024 * 1024) {
  //     try {
  //       this.storageService.deleteImage(this.gebruiker); // delete old image
  //       const downloadURL = await this.storageService.uploadImage(file, this.gebruiker) // upload new image
  //       if (downloadURL) {
  //         this.gebruiker.avatar = downloadURL.ref.name; // set new image name
  //         this.globalsService.setGebruiker(this.gebruiker); // update global gebruiker
  //         await this.dataService.updateGebruiker(this.gebruiker);  // update gebruiker in database
  //         this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker); // update profile image url
  //       }
  //     } catch (error) {
  //       this.errService.showAlert('Fout', 'Er is een fout opgetreden tijdens het uploaden van de afbeelding.');
  //     }
  //   } else {
  //     this.errService.showAlert('Fout', 'Het bestand is te groot. Maximaal toegestane grootte is 3.5MB.');
  //   }
  // }
}