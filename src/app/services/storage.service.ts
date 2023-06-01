import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import Gebruiker from '../types/Gebruiker';
import { Observable, finalize, firstValueFrom, from, lastValueFrom, map, of } from 'rxjs';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { ErrorService } from './error.service';
import { BackendApiService } from './backend-api.service';
import { GlobalsService } from './globals.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage,
    private dataService: BackendApiService,
    private globalsService: GlobalsService,
    private errService: ErrorService) { }

  async deleteImage(gebruiker: Gebruiker): Promise<void> {
    try {
      const imageRef = this.storage.ref(`images/${gebruiker?.id}/${gebruiker?.avatar}`);
      if (imageRef)
        imageRef.delete();
    } catch (error) {
      this.errService.showAlert('Fout', 'Oeps, er is iets misgegaan. Probeer het later opnieuw.')
      throw error;
    }
  };

  uploadImage(file: File, gebruiker: Gebruiker): Promise<UploadTaskSnapshot | undefined> {
    const filePath = `images/${gebruiker.id}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return lastValueFrom(
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await lastValueFrom(fileRef.getDownloadURL());
          if (downloadURL) {
            return downloadURL;
          } else {
            this.errService.showAlert('Fout', 'Oeps, er is iets misgegaan bij het ophalen van de afbeelding. Probeer het later opnieuw.');
            throw new Error('Download URL is not available.');
          }
        })
      )
    );
  };

  getProfileImageUrl(gebruiker: Gebruiker): Promise<string> | string {
    if (gebruiker?.avatar) {
      const firestoreImagePath = `images/${gebruiker?.id}/${gebruiker?.avatar}`;
      const firestoreRef = this.storage.ref(firestoreImagePath);
      const downloadURL$ = firestoreRef.getDownloadURL();
      return firstValueFrom(downloadURL$) as unknown as Promise<string>;
    }
    return '';
  };

  async uploadImageFromWeb(file: File, gebruiker: Gebruiker): Promise<string | null> {
    if (file) {
      if (file.size <= 3.5 * 1024 * 1024) {
        if (file.type.startsWith('image/')) {
          try {
            this.deleteImage(gebruiker);
            const downloadURL = await this.uploadImage(file, gebruiker);
            if (downloadURL) {
              gebruiker.avatar = downloadURL.ref.name;
              await this.globalsService.setGebruiker(gebruiker);
              await this.dataService.updateGebruiker(gebruiker);
              return await this.getProfileImageUrl(gebruiker);
            }
          } catch (error) {
            this.errService.showAlert('Fout', 'Er is een fout opgetreden tijdens het uploaden van de afbeelding.')
            return null;
          }
        } else {
          this.errService.showAlert('Fout', 'Alleen afbeeldingsbestanden zijn toegestaan.')
          return null;
        }
      } else {
        this.errService.showAlert('Fout', 'Het bestand is te groot. Maximaal toegestane grootte is 3.5MB.')
        return null;
      }
      this.errService.showAlert('Fout', 'Alleen afbeeldingen zijn toegestaan.')
      return null;
    }
    return null;
  };

  async uploadImageFromMobile(imageUrl: string, gebruiker: Gebruiker): Promise<string | null> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' }); // convert blob to file

    if (file.size <= 3.5 * 1024 * 1024) {
      try {
        this.deleteImage(gebruiker); // delete old image
        const downloadURL = await this.uploadImage(file, gebruiker) // upload new image
        if (downloadURL) {
          gebruiker.avatar = downloadURL.ref.name; // set new image name
          await this.globalsService.setGebruiker(gebruiker); // update global gebruiker
          await this.dataService.updateGebruiker(gebruiker);  // update gebruiker in database
          return await this.getProfileImageUrl(gebruiker); // update profile image url
        }
      } catch (error) {
        this.errService.showAlert('Fout', 'Er is een fout opgetreden tijdens het uploaden van de afbeelding.');
        return null;
      }
    } else {
      this.errService.showAlert('Fout', 'Het bestand is te groot. Maximaal toegestane grootte is 3.5MB.');
      return null;
    }
    return null;
  };
}
