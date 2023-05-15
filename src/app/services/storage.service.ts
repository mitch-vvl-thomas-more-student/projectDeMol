import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import Gebruiker from '../types/Gebruiker';
import { Observable, finalize, from, map } from 'rxjs';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage, 
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
  }

  uploadImage(file: File, gebruiker : Gebruiker): Observable<UploadTaskSnapshot | undefined> {
    const filePath = `images/${gebruiker.id}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return uploadTask.snapshotChanges().pipe(
      finalize(() => {
        return from(fileRef.getDownloadURL()).pipe(
          map(downloadURL => {
            if (downloadURL) {
              return downloadURL;
            } else {
              this.errService.showAlert('Fout', 'Oeps, er is iets misgegaan bij het ophalen van de afbeelding. Probeer het later opnieuw.')
            }
          })
        );
      })
    );
  }

  getProfileImageUrl(gebruiker: Gebruiker): Observable<string> | null {
    if (gebruiker?.avatar) {
      const firestoreImagePath = `images/${gebruiker?.id}/${gebruiker?.avatar}`;
      const firestoreRef = this.storage.ref(firestoreImagePath);
      return firestoreRef.getDownloadURL();
    }
    return null;
  }
}
