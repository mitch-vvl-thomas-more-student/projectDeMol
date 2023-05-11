import { StorageService } from './../../services/storage.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { GlobalsService } from './../../services/globals.service';
import { Component } from '@angular/core';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Gebruiker from 'src/app/types/Gebruiker';
import { Observable, from } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map } from 'rxjs/operators';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gebruiker: Gebruiker;
  profileImageUrl$: Observable<string> | null;

  constructor(
    private storageService : StorageService,
    private dataService: BackendApiService,
    private globalsService: GlobalsService,
    public authService: AuthService,
    private alertController: AlertController) {
  }
  async ngOnInit() {
    this.gebruiker = await this.globalsService.getGebruiker();
    this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker);
  }

  async update() {
    await this.dataService.updateGebruiker(this.gebruiker);
    await this.globalsService.setGebruiker(this.gebruiker);
  }

  // #uploadImage(file: File): Observable<UploadTaskSnapshot | undefined> {
  //   const filePath = `images/${this.gebruiker.id}/${file.name}`;
  //   const fileRef = this.storage.ref(filePath);
  //   const uploadTask = this.storage.upload(filePath, file);

  //   return uploadTask.snapshotChanges().pipe(
  //     finalize(() => {
  //       return from(fileRef.getDownloadURL()).pipe(
  //         map(downloadURL => {
  //           if (downloadURL) {
  //             return downloadURL;
  //           } else {
  //             console.error('Failed to retrieve download URL');
  //             throw new Error('Failed to retrieve download URL');
  //           }
  //         })
  //       );
  //     })
  //   );
  // }

  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size <= 3.5 * 1024 * 1024) {
        if (file.type.startsWith('image/')) {
          try {
            this.storageService.deleteImage(this.gebruiker);
            this.storageService.uploadImage(file, this.gebruiker).subscribe(async downloadURL => {
              if (downloadURL) {
                this.gebruiker.avatar = downloadURL.ref.name;
                this.globalsService.setGebruiker(this.gebruiker);
                await this.dataService.updateGebruiker(this.gebruiker);
                this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker)
              }
            });;
          } catch (error) {
            this.#showErrorAlert('Er is een fout opgetreden tijdens het uploaden van de afbeelding.');
            console.error(error);
          }
        } else {
          this.#showErrorAlert('Alleen afbeeldingsbestanden zijn toegestaan.');
        }
      } else {
        this.#showErrorAlert('Het bestand is te groot. Maximaal toegestane grootte is 3.5MB.');
      }
    }
  }

  // getProfileImageUrl(): Observable<string> | null {
  //   if (this.gebruiker?.avatar) {
  //     const firestoreImagePath = `images/${this.gebruiker?.id}/${this.gebruiker?.avatar}`;
  //     const firestoreRef = this.storage.ref(firestoreImagePath);
  //     return firestoreRef.getDownloadURL();
  //   }
  //   return null;
  // }

  async #showErrorAlert(errorMessage: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Fout',
      message: errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }

  openFilePicker() {
    document.getElementById('btn_file')?.click();
  }

  // async #deleteImage(): Promise<void> {
  //   try {
  //     const imageRef = this.storage.ref(`images/${this.gebruiker?.id}/${this.gebruiker?.avatar}`);
  //     if (imageRef)
  //       imageRef.delete();
  //   } catch (error) {
  //     this.#showErrorAlert('Oeps, er is iets misgegaan. Probeer het later opnieuw.');
  //     throw error;
  //   }
  // }
}
